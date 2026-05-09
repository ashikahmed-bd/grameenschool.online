import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'
const toastStore = useToastStore()

export const useCouponStore = defineStore('coupon', {
  state: () => ({
    loading: false,
    errors: {},
    coupons: {},
    coupon: {},
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await apiClient.get('/api/v1/coupons', {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          this.coupons = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
        }
      }
    },

    async show(coupon) {
      try {
        const response = await apiClient.get(`/api/v1/coupon/${coupon}`)
        if (response.status === 200) {
          this.contact = response.data.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
        }
      }
    },

    async update(coupon, router) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/v1/coupon/${coupon}`, {
          status: coupon.status,
        })
        if (response.status === 200) {
          toastStore.success(response.data.message)
          router.push({ name: 'contacts' })
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
        }
      } finally {
        this.loading = false
      }
    },

    async delete(coupon) {
      try {
        const response = await apiClient.delete(`/api/v1/coupon/${coupon}`)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
        }
      }
    },
  },
})
