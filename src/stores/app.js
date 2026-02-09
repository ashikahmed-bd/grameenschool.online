import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'
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
        const response = await axiosInstance.get('api/v1/dashboard')
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
        const response = await axiosInstance.get('/api/settings')
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
        const response = await axiosInstance.delete('api/v1/tokens/flush')
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
        const response = await axiosInstance.get('api/v1/reboot')
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
