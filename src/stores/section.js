import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'

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
        const response = await axiosInstance.get(`/api/v1/course/${course}/sections`)
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
        const response = await axiosInstance.post(`/api/v1/course/${course}/sections`, formData)
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
        const response = await axiosInstance.get(`/api/v1/course/${course}/sections/${section}`)
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
        const response = await axiosInstance.post(
          `/api/v1/course/${course}/sections/${section}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
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

    async delete(courseId, sectionId) {
      this.loading = true
      const toastStore = useToastStore()
      try {
        const response = await axiosInstance.delete(
          `/api/v1/course/${courseId}/sections/${sectionId}`,
        )
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
