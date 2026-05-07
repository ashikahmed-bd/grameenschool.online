import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'
const toastStore = useToastStore()

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    loading: false,
    errors: {},
    notices: {},
    notice: {},
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await apiClient.get('/api/v1/notices', {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          this.notices = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async store(formData) {
      this.loading = true
      try {
        const response = await apiClient.post('/api/v1/notices', formData)
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

    async show(notice) {
      this.loading = true
      try {
        const response = await apiClient.get(`/api/v1/notices/${notice}`)
        if (response.status === 200) {
          this.notice = response.data
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
  },
})
