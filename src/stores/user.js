import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'
const toastStore = useToastStore()

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: false,
    errors: {},
    users: [],
    user: {},
  }),

  getters: {},

  actions: {
    async all(page = 1, params = {}) {
      try {
        const response = await apiClient.get('/api/v1/users', {
          params: {
            page,
            query: params.query || '',
            role: params.role || '',
          },
        })
        if (response.status === 200) {
          this.users = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async store(formData, router) {
      this.loading = true
      try {
        const response = await apiClient.post('/api/v1/users', formData)
        if (response.status === 201) {
          toastStore.success(response.data.message)
          router.push({ name: 'users' })
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

    async show(user) {
      this.loading = true
      try {
        const response = await apiClient.get(`/api/v1/users/${user}`)
        if (response.status === 200) {
          this.user = response.data
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

    async update(user, formData) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/users/${user}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'X-HTTP-Method-Override': 'PUT' },
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

    async delete(userId) {
      this.loading = true
      try {
        const response = await apiClient.delete(`/api/v1/users/${userId}`)
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

    async search(params = {}) {
      this.loading = true
      try {
        const response = await apiClient.get(`/api/v1/users/search`, {
          params: params,
        })
        if (response.status === 200) {
          this.users = response.data
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

    async makeInstructor(user, formData) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/users/${user}/make-instructor`, formData)
        if (response.status === 201) {
          toastStore.success(response.data.message)
          return Promise.resolve(response)
        }
      } catch (error) {
        if (error.response) {
          toastStore.error(error.response.data.message)
          return Promise.reject(error.response)
        }
      } finally {
        this.loading = false
      }
    },
  },
})
