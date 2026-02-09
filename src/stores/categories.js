import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'

const toastStore = useToastStore()

export const useCategoryStore = defineStore('category', {
  state: () => ({
    loading: false,
    errors: {},
    categories: {},
    category: {},
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await axiosInstance.get('/api/v1/categories', {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          this.categories = response.data
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
        const response = await axiosInstance.post('/api/v1/categories', formData)
        if (response.status === 201) {
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

    async show(categoryId) {
      this.loading = true
      try {
        const response = await axiosInstance.get(`/api/v1/categories/${categoryId}`)
        if (response.status === 200) {
          this.category = response.data
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

    async update(categoryId, formData) {
      this.loading = true
      try {
        const response = await axiosInstance.post(`/api/v1/categories/${categoryId}`, formData)
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

    async delete(categoryId) {
      this.loading = true
      try {
        const response = await axiosInstance.delete(`/api/v1/categories/${categoryId}`)
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

    async search() {
      try {
        const response = await axiosInstance.get('/api/v1/categories/search')
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      }
    },

    async courses(categoryId) {
      try {
        const response = await axiosInstance.get(`/api/v1/categories/${categoryId}/courses`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      }
    },
  },
})
