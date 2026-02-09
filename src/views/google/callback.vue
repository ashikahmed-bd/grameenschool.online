<script setup>
import axiosInstance from '@/utils/axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref(null);
const message = ref(null)

onMounted(async () => {
    const code = route.query.code
    if (!code) {
        error.value = 'Authorization code missing'
        loading.value = false
        return
    }

    try {
        const response = await axiosInstance.get('/api/google/callback', {
            params: { code }
        })

        if (response.status === 200) {
            message.value = response.data.message || 'Google connected successfully'
            // Cleaner redirect
            await new Promise(resolve => setTimeout(resolve, 2000))
            router.push({ name: 'meets' })
        }
    } catch (err) {
        console.error(err)
        error.value = err.response?.data?.message || err.message || 'Google authorization failed'
    } finally {
        loading.value = false
    }
});
</script>

<template>
    <main class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div class="w-full max-w-md p-6 rounded-lg text-center" :class="{
            'text-yellow-500': loading,
            'text-green-500': message,
            'text-red-500': error && !message
        }">
            <div v-if="loading" class="text-lg font-medium">
                Connecting to Google...
            </div>
            <div v-else-if="message" class="text-lg font-medium">
                {{ message }}
            </div>
            <div v-else-if="error" class="text-lg font-medium">
                {{ error }}
            </div>
        </div>
    </main>
</template>

<style scoped></style>
