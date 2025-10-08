<script setup lang="ts">
import { ref, watch } from 'vue'
import { mdiDelete } from '@mdi/js'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { useAccountsStore } from '@/stores/accounts'

const accountsStore = useAccountsStore();

const errors = ref<Record<number, { login?: string; password?: string }>>({})
const labelInputs = ref<string[]>([])
const showPassword = ref<boolean[]>([])

function syncLabelInputs() {
  labelInputs.value = accountsStore.accounts.map(a => labelsToString(a.labels))
  showPassword.value = accountsStore.accounts.map(() => false)
}

syncLabelInputs()
watch(
  () => accountsStore.accounts.length,
  () => syncLabelInputs()
)

function togglePassword(index: number) {
  showPassword.value[index] = !showPassword.value[index]
}
watch(
  labelInputs,
  (newVals) => {
    newVals.forEach((text, i) => {
      const acc = accountsStore.accounts[i]
      if (!acc) return
      const asString = labelsToString(acc.labels)
      if (asString !== text) {
        acc.labels = parseLabels(text)
      }
    })
  },
  { deep: true }
)

function parseLabels(text: string) {
  if (!text) return [] as { text: string }[]
  return text.split(';').map(s => ({ text: s.trim() })).filter(l => l.text.length > 0)
}

function labelsToString(labels: { text: string }[]) {
  return labels.map(l => l.text).join(';')
}

function validate(index: number) {
  const acc = accountsStore.accounts[index]
  if (!acc) return

  const e: { login?: string; password?: string } = {}
  if (!acc.login || acc.login.trim().length === 0) e.login = 'Логин обязателен'
  else if (acc.login.length > 100) e.login = 'Максимум 100 символов'

  if (acc.type === 'Локальная') {
    if (!acc.password || acc.password.trim().length === 0) e.password = 'Пароль обязателен'
    else if (acc.password.length > 100) e.password = 'Максимум 100 символов'
  }
  errors.value[index] = e
}
</script>

<template>
  <div>
    <v-row v-for="(account, index) in accountsStore.accounts" :key="index" class="my-2" dense>
      <v-col cols="3">
        <v-text-field v-model="labelInputs[index]" label="Метка" dense placeholder="метки через ;" :counter="50"
          maxlength="50" @blur="() => validate(index)" />
      </v-col>

      <v-col cols="3">
        <v-select v-model="account.type" :items="['Локальная', 'LDAP']" label="Тип записи" dense
          @update:modelValue="() => validate(index)" />
      </v-col>

      <v-col cols="3">
        <v-text-field v-model="account.login" label="Логин" dense :error="!!errors[index]?.login"
          :error-messages="errors[index]?.login" @blur="() => validate(index)" :counter="100" maxlength="100" />
      </v-col>

      <v-col cols="2" v-if="account.type === 'Локальная'">
        <v-text-field v-model="account.password" :type="showPassword[index] ? 'text' : 'password'" label="Пароль" dense
          :error="!!errors[index]?.password" :error-messages="errors[index]?.password" @blur="() => validate(index)"
          :counter="100" maxlength="100" :append-inner-icon="showPassword[index] ? mdiEye : mdiEyeOff"
          @click:append-inner="togglePassword(index)" />
      </v-col>

      <v-col cols="1">
        <v-btn icon color="red" @click="accountsStore.removeAccount(index)">
          <v-icon :icon="mdiDelete" />
        </v-btn>
      </v-col>

    </v-row>
  </div>
</template>
