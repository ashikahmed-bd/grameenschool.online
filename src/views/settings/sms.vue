<script setup>
import { onMounted, reactive } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useSettingsStore } from '@/stores/settings'

const form = reactive({
    sms_base_url: '',
    sms_api_key: '',
    sms_type: '',
    sms_sender_id: '',
    sms_enabled: '',
})

const settingsStore = useSettingsStore()

const loadSmsSettings = async () => {
    const response = await settingsStore.getSmsSettings()
    form.sms_base_url = response.sms.base_url
    form.sms_api_key = response.sms.api_key
    form.sms_type = response.sms.type
    form.sms_sender_id = response.sms.sender_id
    form.sms_enabled = response.sms.enabled
}

const submit = () => {
    const payload = {
        base_url: form.sms_base_url,
        api_key: form.sms_api_key,
        type: form.sms_type,
        sender_id: form.sms_sender_id,
        enabled: form.sms_enabled,
    }

    settingsStore.updateSmsSettings(payload)
}

onMounted(() => {
    loadSmsSettings()
})
</script>

<template>
    <div class="space-y-2 mb-6">
        <div class="mb-6 flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-semibold">SMS Settings</h2>
                <p class="text-sm text-gray-500 mt-1">
                    Configure your BulkSMSBD credentials below to send SMS notifications.
                </p>
            </div>

            <a href="https://bulksmsbd.net/login" target="_blank"
                class="text-sm text-primary font-medium hover:underline">
                Create an account
            </a>
        </div>


        <div class="w-full max-w-2xl">
            <form @submit.prevent="submit">
                <!-- SMS Base URL -->
                <div class="form__group">
                    <label class="form__label">SMS Base URL</label>
                    <input type="text" v-model="form.sms_base_url" class="form__control"
                        placeholder="https://bulksmsbd.net" />
                </div>

                <!-- SMS API Key -->
                <div class="form__group mt-4">
                    <label class="form__label">SMS API Key</label>
                    <input type="text" v-model="form.sms_api_key" class="form__control" placeholder="Your API Key" />
                </div>

                <!-- SMS Type -->
                <div class="form__group mt-4">
                    <label class="form__label">SMS Type</label>
                    <select v-model="form.sms_type" class="form__control">
                        <option value="text">Text</option>
                        <option value="unicode">Unicode</option>
                    </select>
                </div>

                <!-- SMS Sender ID -->
                <div class="form__group mt-4">
                    <label class="form__label">Sender ID</label>
                    <input type="text" v-model="form.sms_sender_id" class="form__control"
                        placeholder="e.g. 8809617621316" />
                </div>

                <!-- SMS Enabled -->
                <div class="form__group mt-4">
                    <label class="form__label">SMS Enabled</label>
                    <select v-model="form.sms_enabled" class="form__control">
                        <option value="0">Disabled</option>
                        <option value="1">Enabled</option>
                    </select>
                </div>

                <!-- Submit Button -->
                <div class="form__group mt-6">
                    <BaseButton :loading="settingsStore.loading">Save Change</BaseButton>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
