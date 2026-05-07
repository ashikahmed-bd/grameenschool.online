import { defineStore } from 'pinia'
import { useToastStore } from '@/stores/toast.js'
import apiClient from '@/utils/axios.js'
const toastStore = useToastStore()

export const useContactStore = defineStore('contact', {
  state: () => ({
    loading: false,
    errors: {},
    contacts: {},
    contact: {},
  }),

  getters: {},

  actions: {
    async all(page) {
      try {
        const response = await apiClient.get('/api/contacts', {
          params: {
            page: page,
          },
        })
        if (response.status === 200) {
          this.contacts = response.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async show(contact) {
      try {
        const response = await apiClient.get(`/api/contact/${contact}`)
        if (response.status === 200) {
          this.contact = response.data.data
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },

    async update(contact, router) {
      this.loading = true
      try {
        const response = await apiClient.put(`/api/contact/${contact.id}`, {
          status: contact.status,
        })
        if (response.status === 200) {
          toastStore.success(response.data.message)
          router.push({ name: 'contacts' })
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

    async delete(contact) {
      try {
        const response = await apiClient.delete(`/api/contact/${contact}`)
        if (response.status === 200) {
          toastStore.success(response.data.message)
          return Promise.resolve(response.data)
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors
          return Promise.reject(error.response.data.errors)
        }
      }
    },
  },
})
