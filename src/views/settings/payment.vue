<script setup>
import { onMounted, reactive } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { usePaymentStore } from '@/stores/payment';
import { storeToRefs } from 'pinia';

const paymentStore = usePaymentStore();
const { gateways } = storeToRefs(paymentStore);

const loadGateways = async () => {
    await paymentStore.getGateways();
}


const saveGateway = async (gateway) => {
    await paymentStore.updateGateway(gateway)
}

onMounted(() => {
    loadGateways();
})

</script>

<template>
    <div class="space-y-6 mb-6">
        <div>
            <h2 class="text-2xl font-semibold">Payment Settings</h2>
            <p class="text-sm text-gray-500 mt-1">
                Configure your payment gateway credentials to enable online transactions.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Example: Repeat this block for each gateway using loop -->
            <div v-for="gateway in gateways.data" :key="gateway.id"
                class="rounded-2xl border border-border p-6 bg-white">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <img :src="gateway.logo_url" class="h-10 w-10 object-contain rounded" />
                        <div>
                            <h3 class="text-lg font-medium">{{ gateway.name }}</h3>
                            <p class="text-xs text-gray-500">{{ gateway.key }}</p>
                        </div>
                    </div>
                    <label class="inline-flex items-center cursor-pointer gap-2">
                        <input type="checkbox" v-model="gateway.enabled" class="sr-only peer" />
                        <div
                            class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-colors relative">
                            <div
                                class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5">
                            </div>
                        </div>
                        <span class="text-sm text-gray-600">
                            {{ gateway.enabled ? 'Enabled' : 'Disabled' }}
                        </span>
                    </label>
                </div>

                <div class="grid gap-3 text-sm">
                    <template v-if="gateway.key === 'sslcommerz'">
                        <div>
                            <label class="block text-gray-600 mb-1">Store ID</label>
                            <input type="text" v-model="gateway.credentials.store_id" class="form__control" />
                        </div>
                        <div>
                            <label class="block text-gray-600 mb-1">Store Password</label>
                            <input type="password" v-model="gateway.credentials.store_password" class="form__control" />
                        </div>
                    </template>

                    <template v-else-if="gateway.key === 'bkash'">
                        <div>
                            <label class="block text-gray-600 mb-1">App Key</label>
                            <input type="text" v-model="gateway.credentials.app_key" class="form__control" />
                        </div>
                        <div>
                            <label class="block text-gray-600 mb-1">App Secret</label>
                            <input type="password" v-model="gateway.credentials.app_secret" class="form__control" />
                        </div>
                        <div>
                            <label class="block text-gray-600 mb-1">Username</label>
                            <input type="text" v-model="gateway.credentials.username" class="form__control" />
                        </div>
                        <div>
                            <label class="block text-gray-600 mb-1">Password</label>
                            <input type="password" v-model="gateway.credentials.password" class="form__control" />
                        </div>
                    </template>
                </div>

                <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="gateway.sandbox" />
                        <label>Sandbox Mode</label>
                    </div>
                    <BaseButton @click="() => saveGateway(gateway)">Save Settings
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped></style>
