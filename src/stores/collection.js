import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'

const toastStore = useToastStore()

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    loading: false,
    errors: {},
    collections: {},
  }),

  getters: {},

  actions: {
    async all() {
      try {
        const response = await apiClient.get('/api/v1/collections')
        if (response.status === 200) {
          this.collections = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {}
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async store(formData) {
      this.loading = true
      try {
        const response = await apiClient.post('/api/v1/collections', formData)
        if (response.status === 201) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {}
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async show(collection) {
      try {
        const response = await apiClient.get(`/api/v1/collections/${collection}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {}
          return Promise.reject(error.response)
        }
      }
    },

    async update(collection, formData) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/collections/${collection}`, formData)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {}
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },

    async delete(collection) {
      try {
        const response = await apiClient.delete(`/api/v1/collections/${collection}`)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {}
          return Promise.reject(error.response)
        }
      }
    },
  },
})
