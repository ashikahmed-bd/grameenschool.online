import { defineStore } from 'pinia'
import apiClient from '@/utils/axios.js'

export const useLectureStore = defineStore('lecture', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async store(course, section, formData) {
      this.loading = true
      try {
        const response = await apiClient.post(
          `/api/v1/courses/${course}/sections/${section}/lectures`,
          formData,
        )
        if (response.status === 201) {
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

    async update(course, lecture, formData) {
      this.loading = true
      try {
        const response = await apiClient.put(
          `/api/v1/courses/${course}/lectures/${lecture}`,
          formData,
        )
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

    async delete(course, lecture) {
      this.loading = true
      try {
        const response = await apiClient.delete(`/api/v1/courses/${course}/lectures/${lecture}`)
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

    async article(course, lecture, formData) {
      this.loading = true
      try {
        const response = await apiClient.put(
          `/api/v1/courses/${course}/lectures/${lecture}/article`,
          formData,
        )
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

    async video(course, lecture, formData) {
      this.loading = true
      try {
        const response = await apiClient.put(
          `/api/v1/courses/${course}/lectures/${lecture}/video`,
          formData,
        )
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
