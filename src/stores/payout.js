import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'
const toastStore = useToastStore()

export const usePayoutStore = defineStore('payout', {
  state: () => ({
    loading: false,
    errors: {},
    payouts: {},
    payout: {},
  }),

  getters: {},

  actions: {
    async all(search, status, page) {
      try {
        const response = await axiosInstance.get(`/api/payouts`, {
          params: {
            search: search,
            status: status,
            page: page,
          },
        })
        if (response.status === 200) {
          this.payouts = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async show(payout) {
      try {
        const response = await axiosInstance.get(`/api/payouts/${payout}`)
        if (response.status === 200) {
          this.payout = response.data.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async update(payout, formData) {
      this.loading = true
      try {
        const response = await axiosInstance.put(`/api/payouts/${payout}`, formData)
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
  },
})
