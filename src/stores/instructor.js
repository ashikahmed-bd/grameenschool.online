import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'

export const useInstructorStore = defineStore('instructor', {
  state: () => ({
    loading: false,
    errors: {},
  }),

  getters: {},

  actions: {
    async all() {
      try {
        const response = await axiosInstance.get(`/api/v1/instructors`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          return Promise.reject(error.response.data)
        }
      }
    },

    async view(instructor) {
      try {
        const response = await axiosInstance.get(`/api/v1/instructors/${instructor}`)
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }
      } catch (error) {
        return Promise.reject(error.response.data)
      }
    },

    async search(query = '') {
      try {
        const response = await axiosInstance.get(`/api/v1/instructors/search`, {
          params: { query, query },
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
  },
})
