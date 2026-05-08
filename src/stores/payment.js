import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'
const toastStore = useToastStore()

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    loading: false,
    errors: {},
    gateways: [],
  }),

  getters: {},

  actions: {
    async getGateways() {
      try {
        const response = await apiClient.get('/api/v1/settings/payment-gateways')
        if (response.status === 200) {
          this.gateways = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async updateGateway(gateway) {
      this.loading = true
      try {
        const response = await apiClient.put(
          `/api/v1/settings/payment-gateways/${gateway.id}`,
          gateway,
        )
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

    async collect(order, formData) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/payments/${order}/verify`, formData)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        console.log(error)
        if (error.response) {
          this.errors = error.response.data.errors
          toastStore.error(error.response.data.message)
          return null
        }
      } finally {
        this.loading = false
      }
    },
  },
})
