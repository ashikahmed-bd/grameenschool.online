import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast'
import apiClient from '@/utils/axios.js'
const toastStore = useToastStore()

export const useCourseStore = defineStore('course', {
  state: () => ({
    loading: false,
    errors: {},
    courses: [],
    course: {},
    curriculum: [],
  }),

  getters: {},

  actions: {
    async all(page) {
      const toastStore = useToastStore()
      try {
        const response = await apiClient.get('/api/v1/courses', {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          this.courses = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          toastStore.error(error.response.data.message)
          return Promise.reject(error.response.data)
        }
      }
    },

    async store(formData, router) {
      this.loading = true

      try {
        const response = await apiClient.post('/api/v1/courses', formData)
        if (response.status === 201) {
          toastStore.success(response.data.message)
          router.push({ name: 'courses' })
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

    async update(course, formData) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/v1/courses/${course}/basic`, formData)
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

    async delete(course) {
      this.loading = true
      try {
        const response = await apiClient.delete(`/api/v1/courses/${course}`)
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

    async search(query) {
      try {
        const response = await apiClient.get('/api/v1/courses/search', {
          params: { query: query },
        })
        if (response.status === 200) {
          this.courses = response.data;
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data)
        }
      }
    },

    async getBasic(course) {
      try {
        const response = await apiClient.get(`/api/v1/courses/${course}/basic`)
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

    async updateBasic(course, formData) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/v1/courses/${course}/basic`, formData)
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

    async uploadCover(course, formData) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/courses/${course}/cover`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
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

    async getCurriculum(course) {
      try {
        const response = await apiClient.get(`/api/v1/courses/${course}/curriculum`)
        if (response.status === 200) {
          this.curriculum = response.data
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
