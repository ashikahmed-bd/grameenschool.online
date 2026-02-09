// utils/axios.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    // Add Bearer token if available
    if (authStore?.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => {
    // Request config error (before sending request)
    return Promise.reject(error)
  },
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      // Auto logout & redirect to login page
      authStore.$reset()

      // Hard reload for full reset
      window.location.replace('/login')
    }

    // Optional: Global error logging
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data?.message || error.message)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
