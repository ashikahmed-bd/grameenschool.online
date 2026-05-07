import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'

const toastStore = useToastStore()

export const useMeetStore = defineStore('meet', {
  state: () => ({
    loading: false,
    errors: {},
    meets: {},
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await apiClient.get('/api/v1/meets', {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          this.meets = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      }
    },

    async store(formData) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/meets`, formData)
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

    async show(meet) {
      try {
        const response = await apiClient.get(`/api/v1/meets/${meet}`)
        if (response.status === 200) {
          this.meet = response.data.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      }
    },

    async update(meet, formData) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/v1/meets/${meet}`, formData)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      } finally {
        this.loading = false
      }
    },

    async delete(meet) {
      this.loading = true
      try {
        const response = await apiClient.delete(`/api/v1/meets/${meet}`)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      } finally {
        this.loading = false
      }
    },

    async join(meet) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/v1/meets/${meet}/join`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
