import { defineStore } from 'pinia'
import apiClient from '@/utils/axios.js'

export const useSectionStore = defineStore('section', {
  state: () => ({
    errors: {},
    loading: false,
    sections: {},
  }),

  getters: {},

  actions: {
    async index(course) {
      try {
        const response = await apiClient.get(`/api/v1/courses/${course}/sections`)
        if (response.status === 200) {
          this.sections = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async store(course, formData) {
      this.loading = true
      try {
        const response = await apiClient.post(`/api/v1/courses/${course}/sections`, formData)
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

    async show(course, section) {
      try {
        const response = await apiClient.get(`/api/v1/courses/${course}/sections/${section}`)
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

    async update(course, section, formData) {
      this.loading = true
      try {
        const response = await apiClient.put(
          `/api/v1/courses/${course}/sections/${section}`,
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

    async delete(course, section) {
      this.loading = true
      try {
        const response = await apiClient.delete(`/api/v1/courses/${course}/sections/${section}`)
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
