import { defineStore } from 'pinia'
import axiosInstance from "@/utils/axios.js";
import { useToastStore } from "@/stores/toast.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loading: false,
        token: null,
        user: {},
        errors: {},
    }),

    // persist: true,

    persist: {
        paths: ['token', 'user'],
    },

    getters: {
        loggedIn: state => !!state.token,
    },

    actions: {
        async login(formData) {
            this.loading = true;
            const toastStore = useToastStore();
            try {
                const response = await axiosInstance.post("/api/auth/login", formData);
                if (response.status === 200) {
                    this.token = response.data?.token;
                    this.user = response.data?.user;
                    toastStore.success(response.data.message);
                    setTimeout(() => {
                        window.location.replace(import.meta.env.BASE_URL);
                    }, 1000);

                    return new Promise((resolve) => {
                        resolve(response.data)
                    });
                }
            } catch (error) {
                if (error.response) {
                    this.errors = error.response.data.errors;
                    toastStore.error(error.response.data.message);
                }
            } finally {
                this.loading = false
            }
        },


        async forgot(formData) {
            this.loading = true;
            const toastStore = useToastStore();
            try {
                const response = await axiosInstance.post("/api/auth/forgot", formData);
                if (response.status === 200) {
                    toastStore.success(response.data.message);
                    return new Promise((resolve) => {
                        resolve(response.data)
                    });
                }
            } catch (error) {
                if (error.response) {
                    this.errors = error.response.data.errors;
                    toastStore.error(error.response.data.message);
                }
            } finally {
                this.loading = false
            }
        },

    },
})