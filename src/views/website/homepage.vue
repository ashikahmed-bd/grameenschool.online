<script setup>
import { ref, onMounted, reactive } from 'vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import { useSettingsStore } from '@/stores/settings';
import BaseTextarea from '@/components/BaseTextarea.vue';
import axiosInstance from "@/utils/axios.js";
import { useToastStore } from "@/stores/toast.js";
const toastStore = useToastStore();

const settingsStore = useSettingsStore();

const form = reactive({
    hero: {
        title: '',
        headline: '',
        overview: '',
        banner_url: ''
    },
    topCategories: {
        title: '',
        overview: ''
    },
    benefits: {
        title: '',
        overview: ''
    },
    reviews: {
        title: '',
        overview: ''
    },
    instructors: {
        title: '',
        overview: ''
    },
    cta: {
        title: '',
        subtitle: '',
        app_links: {
            google_play: '',
            app_store: ''
        },
        app_url: '',
        social: {
            heading: '',
            description: '',
            links: {
                facebook: '',
                twitter: '',
                instagram: '',
                linkedin: '',
                youtube: ''
            }
        },
    }
});

const loadHomepage = async () => {
    const response = await settingsStore.getHomepage();
    form.hero.title = response.hero.title;
    form.hero.headline = response.hero.headline;
    form.hero.overview = response.hero.overview;
    form.hero.banner_url = response.hero.banner_url;

    form.topCategories.title = response.topCategories.title;
    form.topCategories.overview = response.topCategories.overview;

    form.benefits.title = response.benefits.title;
    form.benefits.overview = response.benefits.overview;

    form.reviews.title = response.reviews.title;
    form.reviews.overview = response.reviews.overview;

    form.instructors.title = response.instructors.title;
    form.instructors.overview = response.instructors.overview;

    form.cta.title = response.cta.title;
    form.cta.subtitle = response.cta.subtitle;
    form.cta.app_links.google_play = response.cta.app_links.google_play;
    form.cta.app_links.app_store = response.cta.app_links.app_store;
    form.cta.app_url = response.cta.app_url;

    form.cta.social.heading = response.cta.social.heading;
    form.cta.social.description = response.cta.social.description;
    form.cta.social.links.facebook = response.cta.social.links.facebook;
    form.cta.social.links.twitter = response.cta.social.links.twitter;
    form.cta.social.links.instagram = response.cta.social.links.instagram;
    form.cta.social.links.linkedin = response.cta.social.links.linkedin;
    form.cta.social.links.youtube = response.cta.social.links.youtube;
};

const submit = async () => {
    await await settingsStore.updateHomepage(form);
};


const uploadHeroBanner = async (event) => {
    const file = event.target.files[0];

    if (!file || file.type !== 'image/png') {
        alert('Please upload a PNG file only.')
        return
    }

    const formData = new FormData()
    formData.append('hero', file);
    try {
        const response = await axiosInstance.post('/api/v1/settings/hero-banner', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        toastStore.success(response.data.message);
    } catch (error) {
        console.error('Upload failed', error)
    }
}


const uploadPreviewApp = async (event) => {
    const file = event.target.files[0];

    if (!file || file.type !== 'image/png') {
        alert('Please upload a PNG file only.')
        return
    }

    const formData = new FormData()
    formData.append('app', file);
    try {
        const response = await axiosInstance.post('/api/v1/settings/preview-app', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        toastStore.success(response.data.message);
    } catch (error) {
        console.error('Upload failed', error)
    }
}

onMounted(() => {
    loadHomepage();
});
</script>

<template>
    <div class="space-y-6 mb-6">
        <div class="mb-6">
            <h2 class="text-xl font-semibold">Homepage Settings</h2>
            <p class="text-sm text-gray-500 mt-1">
                Customize how your public dashboard or landing page looks and feels.
            </p>
        </div>

        <form @submit.prevent="submit" class="space-y-8">
            <!-- Hero Section -->
            <section class="bg-white p-6 rounded-2xl border border-border">
                <h3 class="text-xl font-semibold mb-1">Hero Section</h3>
                <div class="grid grid-cols-3 gap-4">
                    <div class="col-span-2">
                        <BaseInput label="Title" v-model="form.hero.title" />
                        <BaseInput label="Headline" v-model="form.hero.headline" />
                        <BaseTextarea label="Overview" v-model="form.hero.overview" type="textarea" />
                    </div>
                    <div class="w-full">
                        <label for="hero" class="form__label">Hero Banner</label>
                        <input type="file" @change="uploadHeroBanner" class="form__file" accept="image/png" />
                        <img v-if="form.hero" :src="form.hero.banner_url"
                            class="bg-black object-cover mt-2 rounded shadow" />
                    </div>
                </div>
            </section>

            <!-- Top Categories -->
            <section class="bg-white p-6 rounded-2xl border border-border">
                <h3 class="text-xl font-semibold mb-1">Top Categories</h3>
                <div class="space-y-4">
                    <BaseInput label="Title" v-model="form.topCategories.title" />
                    <BaseInput label="Overview" v-model="form.topCategories.overview" type="textarea" />
                </div>
            </section>

            <!-- Benefits -->
            <section class="bg-white p-6 rounded-2xl border border-border">
                <h3 class="text-xl font-semibold mb-1">Benefits</h3>

                <div class="space-y-4">
                    <BaseInput label="Title" v-model="form.benefits.title" />
                    <BaseInput label="Overview" v-model="form.benefits.overview" type="textarea" />
                </div>
            </section>

            <!-- Student Reviews -->
            <section class="bg-white p-6 rounded-2xl border border-border">
                <h3 class="text-xl font-semibold mb-1">Student Reviews</h3>
                <div class="space-y-4">
                    <BaseInput label="Title" v-model="form.reviews.title" />
                    <BaseInput label="Overview" v-model="form.reviews.overview" type="textarea" />
                </div>
            </section>

            <!-- Instructors -->
            <section class="bg-white p-6 rounded-2xl border border-border">
                <h3 class="text-xl font-semibold mb-1">Instructors</h3>
                <div class="space-y-4">
                    <BaseInput label="Title" v-model="form.instructors.title" />
                    <BaseInput label="Overview" v-model="form.instructors.overview" type="textarea" />
                </div>
            </section>

            <!-- CTA Section -->
            <section class="bg-white p-6 rounded-2xl border border-border">
                <h3 class="text-xl font-semibold mb-1">Call To Action (CTA)</h3>
                <div class="grid grid-cols-3 gap-4">
                    <div class="col-span-2">
                        <BaseInput label="Title" v-model="form.cta.title" />
                        <BaseInput label="Subtitle" v-model="form.cta.subtitle" />
                        <BaseInput label="Google Play Link" v-model="form.cta.app_links.google_play" />
                        <BaseInput label="App Store Link" v-model="form.cta.app_links.app_store" />
                    </div>
                    <div class="">
                        <label for="preview_app" class="form__label">Preview App</label>
                        <input type="file" @change="uploadPreviewApp" class="form__file" accept="image/png" />
                        <img v-if="form.hero" :src="form.cta.app_url"
                            class="bg-black object-cover mt-2 rounded shadow" />
                    </div>
                </div>


                <div class="mt-6">
                    <h4 class="text-lg font-medium mb-2">Social Info</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BaseInput label="Heading" v-model="form.cta.social.heading" />
                        <BaseInput label="Description" v-model="form.cta.social.description" type="textarea" />
                        <BaseInput label="Facebook" v-model="form.cta.social.links.facebook" />
                        <BaseInput label="Twitter" v-model="form.cta.social.links.twitter" />
                        <BaseInput label="Instagram" v-model="form.cta.social.links.instagram" />
                        <BaseInput label="LinkedIn" v-model="form.cta.social.links.linkedin" />
                        <BaseInput label="YouTube" v-model="form.cta.social.links.youtube" />
                    </div>
                </div>
            </section>

            <!-- Submit Button -->
            <div class="flex justify-end">
                <BaseButton :loading="settingsStore.loading">Save Settings</BaseButton>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
