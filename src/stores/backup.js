import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'

export const useBackupStore = defineStore('backup', {
  state: () => ({
    loading: false,
    errors: {},
    backups: {},
    backup: null,
  }),

  getters: {},

  actions: {
    async all() {
      try {
        const response = await axiosInstance.get('/api/v1/backup/all')
        if (response.status === 200) {
          this.backups = response.data
          return response.data
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {}
          return Promise.reject(error.response.data)
        }
        return Promise.reject({ message: 'Network error' })
      } finally {
        this.loading = false
      }
    },

    async create() {
      const toastStore = useToastStore()
      this.loading = true
      try {
        const response = await axiosInstance.post('/api/v1/backup/create')
        if (response.status === 201) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {}
          return Promise.reject(error.response.data)
        }
        return Promise.reject({ message: 'Network error' })
      } finally {
        this.loading = false
      }
    },

    async download(file) {
      try {
        const response = await axiosInstance.get(`/api/v1/backup/download/${file}`, {
          responseType: 'blob',
        })

        const blob = new Blob([response.data], { type: 'application/zip' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = file
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)

        return true
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {}
          return Promise.reject(error.response.data)
        }
        return Promise.reject({ message: 'Network error' })
      } finally {
        this.loading = false
      }
    },
  },
})
