import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'
const toastStore = useToastStore()

export const useAppStore = defineStore('app', {
  state: () => ({
    errors: [],
    loading: false,
    settings: {},
    home: {},
  }),

  persist: {
    paths: ['settings'],
  },

  getters: {},

  actions: {
    async dashboard() {
      try {
        const response = await apiClient.get('api/v1/dashboard')
        if (response.status === 200) {
          this.home = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      }
    },

    async getSettings() {
      try {
        const response = await apiClient.get('/api/settings')
        if (response.status === 200) {
          this.settings = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      }
    },

    async ClearAllToken() {
      try {
        const response = await apiClient.delete('api/v1/tokens/flush')
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response.data)
        }
      }
    },

    async cacheClear() {
      try {
        const response = await apiClient.get('api/v1/reboot')
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response.data)
        }
      }
    },
  },
})
