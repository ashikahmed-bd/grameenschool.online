import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'
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
        const response = await axiosInstance.get('/api/v1/settings/payment-gateways')
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
        const response = await axiosInstance.put(
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

    async approved(invoiceId) {
      this.loading = true
      try {
        const response = await axiosInstance.get('/api/v1/payment/approved', {
          params: {
            invoice_id: invoiceId,
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
