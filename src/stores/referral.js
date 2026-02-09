import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'
const toastStore = useToastStore()

export const useReferralStore = defineStore('referral', {
  state: () => ({
    loading: false,
    errors: {},
  }),

  getters: {},

  actions: {
    async store(formData) {
      this.loading = true
      try {
        const response = await axiosInstance.post('/api/v1/referrals', formData)
        if (response.status === 201) {
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

    async update(formData) {
      this.loading = true
      try {
        const response = await axiosInstance.put(`/api/v1/referrals/update`, formData)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          toastStore.error(error.response.data.message)
          return Promise.reject(error.response.data.errors)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
