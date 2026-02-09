import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'

export const useLectureStore = defineStore('lecture', {
  state: () => ({
    errors: {},
    loading: false,
  }),

  getters: {},

  actions: {
    async store(courseId, sectionId, formData) {
      this.loading = true
      try {
        const response = await axiosInstance.post(
          `/api/v1/course/${courseId}/sections/${sectionId}/lectures`,
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
        const response = await axiosInstance.put(
          `/api/v1/course/${course}/lectures/${lecture}`,
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
      const toastStore = useToastStore()
      try {
        const response = await axiosInstance.delete(`/api/v1/course/${course}/lectures/${lecture}`)
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
  },
})
