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

    async approved(invoice) {
      this.loading = true
      try {
        const response = await apiClient.get('/api/v1/payment/approved', {
          params: {
            invoice_id: invoice,
          },
        })
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
