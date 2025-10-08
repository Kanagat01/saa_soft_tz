<script lang="ts" setup>
import AccountForm from './components/AccountForm.vue'
import CreateAccount from './components/CreateAccount.vue'
import { mdiHelpCircleOutline } from '@mdi/js'
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <div class="d-flex align-center mt-5">
          <h1 class="me-4">Учетные записи</h1>
          <CreateAccount />
        </div>

        <div class="d-flex align-center mt-5 mb-5 py-1 px-2" style="background-color: rgb(237, 242, 250);">
          <v-icon :icon="mdiHelpCircleOutline" class="me-2" />
          <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
        </div>
        <AccountForm />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
