import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios.js'
import { useToastStore } from '@/stores/toast.js'
const toastStore = useToastStore()

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    errors: [],
    loading: false,
  }),

  getters: {},

  actions: {
    async getGeneral() {
      try {
        const response = await axiosInstance.get('api/v1/settings/general')
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

    async appearance(formData) {
      const toastStore = useToastStore()
      this.loading = true
      try {
        const response = await axiosInstance.put('api/v1/settings/general', formData)
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

    async getContact() {
      try {
        const response = await axiosInstance.get('api/v1/settings/contact')
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

    async contact(formData) {
      const toastStore = useToastStore()
      this.loading = true
      try {
        const response = await axiosInstance.put('api/v1/settings/contact', formData)
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

    async getSeo() {
      try {
        const response = await axiosInstance.get('api/v1/settings/seo')
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

    async seo(formData) {
      const toastStore = useToastStore()
      this.loading = true
      try {
        const response = await axiosInstance.put('api/v1/settings/seo', formData)
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

    async getPayment() {
      try {
        const response = await axiosInstance.get('api/v1/settings/payment')
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

    async payment(formData) {
      const toastStore = useToastStore()
      this.loading = true
      try {
        const response = await axiosInstance.put('api/v1/settings/payment', formData)
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

    async getSmsSettings() {
      try {
        const response = await axiosInstance.get('api/v1/settings/sms')
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

    async updateSmsSettings(formData) {
      const toastStore = useToastStore()
      this.loading = true
      try {
        const response = await axiosInstance.put('api/v1/settings/sms', formData)
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

    async getHomepage() {
      try {
        const response = await axiosInstance.get('api/v1/settings/homepage')
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

    async updateHomepage(formData) {
      this.loading = true
      try {
        const response = await axiosInstance.put('api/v1/settings/homepage', formData)
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
