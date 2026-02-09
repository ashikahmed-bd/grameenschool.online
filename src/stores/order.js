import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'
const toastStore = useToastStore()

export const useOrderStore = defineStore('order', {
  state: () => ({
    loading: false,
    errors: {},
    orders: {},
    order: {},
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await axiosInstance.get('/api/v1/orders', {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          this.orders = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async store(formData) {
      this.loading = true
      try {
        const response = await axiosInstance.post('/api/v1/orders', formData)
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

    async show(id) {
      this.loading = true
      try {
        const response = await axiosInstance.get(`/api/v1/orders/${id}`)
        if (response.status === 200) {
          this.order = response.data.data
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

    async update(userId, formData) {
      this.loading = true
      try {
        const response = await axiosInstance.put(`/api/v1/orders/${userId}`, formData)
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

    async delete(userId) {
      this.loading = true
      try {
        const response = await axiosInstance.delete(`/api/v1/orders/${userId}`)
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
