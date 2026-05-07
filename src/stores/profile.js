import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'
const toastStore = useToastStore()

export const useProfileStore = defineStore('profile', {
  state: () => ({
    loading: false,
    errors: {},
  }),

  getters: {},

  actions: {
    async getProfile() {
      try {
        const response = await apiClient.get('/api/auth/profile')
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async update(formData) {
      this.loading = true
      try {
        const response = await apiClient.post('/api/auth/profile', formData)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        const response = await apiClient.post('/api/auth/logout')
        if (response.status === 200) {
          const toastStore = useToastStore()
          toastStore.success(response.data.message)
          this.$reset()
          return new Promise((resolve) => {
            resolve(response)
          })
        }
      } catch (error) {
        const toastStore = useToastStore()
        if (error.response) {
          this.errors = error.response.data.errors
          toastStore.error(error.response.data.message)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
