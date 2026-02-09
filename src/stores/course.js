import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast'
const toastStore = useToastStore()

export const useCourseStore = defineStore('course', {
  state: () => ({
    loading: false,
    errors: {},
    courses: [],
    course: {},
    curriculum: [],
    total_draft: 0,
    total_pending: 0,
    total_published: 0,
    total_archived: 0,
  }),

  getters: {},

  actions: {
    async all(page) {
      const toastStore = useToastStore()
      try {
        const response = await axiosInstance.get('/api/v1/courses', {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          this.courses = response.data
          this.total_draft = response.data.total_draft
          this.total_pending = response.data.total_pending
          this.total_published = response.data.total_published
          this.total_archived = response.data.total_archived
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
        const response = await axiosInstance.post('/api/v1/course/store', formData)
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
        const response = await axiosInstance.put(`/api/v1/course/${course}/basic`, formData)
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
        const response = await axiosInstance.delete(`/api/v1/course/${course}`)
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
        const response = await axiosInstance.get('/api/v1/courses/search', {
          params: { query: query },
        })
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

    async getBasic(course) {
      try {
        const response = await axiosInstance.get(`/api/v1/courses/${course}/basic`)
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
        const response = await axiosInstance.put(`/api/v1/courses/${course}/basic`, formData)
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

    async getTargets(course) {
      try {
        const response = await axiosInstance.get(`/api/v1/courses/${course}/targets`)
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

    async updateTargets(course, formData) {},

    async uploadCover(course, formData) {
      try {
        const response = await axiosInstance.post(`/api/v1/courses/${course}/cover`, formData, {
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
      }
    },

    async getCurriculum(course) {
      try {
        const response = await axiosInstance.get(`/api/v1/courses/${course}/curriculum`)
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
