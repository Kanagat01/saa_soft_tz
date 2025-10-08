<script setup lang="ts">

import { mdiPlus } from '@mdi/js'
import { useAccountsStore } from '@/stores/accounts';

const accountsStore = useAccountsStore()

</script>

<template>
    <v-btn color="primary" icon @click="accountsStore.addAccount()">
        <v-icon :icon="mdiPlus" />
    </v-btn>
</template>
