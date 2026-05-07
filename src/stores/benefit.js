import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'
const toastStore = useToastStore()

export const useBenefitStore = defineStore('benefit', {
  state: () => ({
    loading: false,
    errors: {},
    benefits: {},
    benefit: {},
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await apiClient.get('/api/v1/benefits', {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          this.benefits = response.data
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
        const response = await apiClient.post('/api/v1/benefit', formData)
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

    async show(benefit) {
      this.loading = true
      try {
        const response = await apiClient.get(`/api/v1/benefit/${benefit}`)
        if (response.status === 200) {
          this.benefit = response.data
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

    async update(benefit, formData) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/benefit/${benefit}`, formData)
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

    async delete(benefit) {
      try {
        const response = await apiClient.delete(`/api/v1/benefit/${benefit}`)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },
  },
})
