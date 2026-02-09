<script setup>
import { reactive, onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import BaseButton from '@/components/BaseButton.vue';

const settingsStore = useSettingsStore();
const { errors } = storeToRefs(settingsStore);


const form = reactive({
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  facebook_verification_code: '',
  facebook_pixel_id: '',
  google_analytics_id: '',
  google_tag_manager_id: '',
  google_verification: '',
  bing_verification: '',
  yandex_verification: '',
});

const loadSeo = async () => {
  const response = await settingsStore.getSeo();
  form.meta_title = response.seo.meta_title;
  form.meta_description = response.seo.meta_description;
  form.meta_keywords = response.seo.meta_keywords;
  form.facebook_verification_code = response.seo.facebook_verification_code;
  form.facebook_pixel_id = response.seo.facebook_pixel_id;
  form.google_analytics_id = response.seo.google_analytics_id;
  form.google_tag_manager_id = response.seo.google_tag_manager_id;
  form.google_verification = response.seo.google_verification;
  form.bing_verification = response.seo.bing_verification;
  form.yandex_verification = response.seo.yandex_verification;
}

const submit = async () => {
  await settingsStore.seo(form);
}


onMounted(() => {
  loadSeo();
})

</script>

<template>
    <div class="space-y-2 mb-6">
        <div class="mb-6">
            <h2 class="text-xl font-semibold">SEO Configaration</h2>
            <p class="text-sm text-gray-500 mt-1">
                Customize how your website appears in search results and improve your visibility.
            </p>
        </div>

        <div class="w-full">
            <form @submit.prevent="submit">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="col-span-2 w-full">
                        <div class="form__group">
                            <label class="form__label">Meta Title</label>
                            <input type="text" v-model="form.meta_title" class="form__control"
                                placeholder="Enter site name" />
                        </div>
                        <div class="form__group">
                            <label class="form__label">Meta Description</label>
                            <textarea class="form__control" v-model="form.meta_description" rows="4" placeholder="Enter site name"></textarea>
                        </div>
                        <div class="form__group">
                            <label class="form__label">Meta Keywords</label>
                            <textarea class="form__control" v-model="form.meta_keywords" rows="4" placeholder="Enter site name"></textarea>
                        </div>
                    </div>

                    <div class="w-full">

                        <!-- Facebook Domain Verification -->
                        <div class="form__group">
                            <label class="form__label">
                                Facebook Domain Verification
                                <a href="https://www.facebook.com/business/help/183845382289385" target="_blank"
                                    class="text-blue-500 underline text-xs ml-1">
                                    Setup Guide
                                </a>
                            </label>
                            <input type="text" v-model="form.facebook_verification_code" class="form__control"
                                placeholder='e.g. "facebook-domain-verification=XXXXXXXX"' />
                        </div>

                        <!-- Facebook Pixel -->
                        <div class="form__group">
                            <label class="form__label">
                                Facebook Pixel ID
                                <a href="https://www.facebook.com/events_manager2/list/pixel/" target="_blank"
                                    class="text-blue-500 underline text-xs ml-1">
                                    Setup Guide
                                </a>
                            </label>
                            <input type="text" v-model="form.facebook_pixel_id" class="form__control"
                                placeholder="e.g. 123456789012345" />
                        </div>


                        <!-- Google Analytics -->
                        <div class="form__group">
                            <label class="form__label">
                                Google Analytics
                                <a href="https://analytics.google.com" target="_blank"
                                    class="text-blue-500 underline text-xs ml-1">Setup Guide</a>
                            </label>
                            <input type="text" v-model="form.google_analytics_id" class="form__control"
                                placeholder="e.g. G-XXXXXXXX" />
                        </div>

                        <!-- Google Tag Manager -->
                        <div class="form__group">
                            <label class="form__label">
                                Google Tag Manager
                                <a href="https://tagmanager.google.com/" target="_blank"
                                    class="text-blue-500 underline text-xs ml-1">Setup Guide</a>
                            </label>
                            <input type="text" v-model="form.google_tag_manager_id" class="form__control"
                                placeholder="e.g. GTM-XXXXXXXX" />
                        </div>

                        <!-- Google Site Verification -->
                        <div class="form__group">
                            <label class="form__label">Google Verification
                                <a href="https://tagmanager.google.com/" target="_blank"
                                    class="text-blue-500 underline text-xs ml-1">Setup Guide</a>
                            </label>
                            <input type="text" v-model="form.google_verification" class="form__control"
                                placeholder="e.g. 5fQ3sdsdgfhjkf78" />
                        </div>

                        <!-- Bing Verification -->
                        <div class="form__group">
                            <label class="form__label">Bing Verification <a href="https://tagmanager.google.com/"
                                    target="_blank" class="text-blue-500 underline text-xs ml-1">Setup Guide</a></label>
                            <input type="text" v-model="form.bing_verification" class="form__control"
                                placeholder="e.g. 07EFC7985049EB8ED8ADE79AD39FE935" />
                        </div>

                        <!-- Yandex Verification -->
                        <div class="form__group">
                            <label class="form__label">Yandex Verification <a href="https://tagmanager.google.com/"
                                    target="_blank" class="text-blue-500 underline text-xs ml-1">Setup Guide</a></label>
                            <input type="text" v-model="form.yandex_verification" class="form__control"
                                placeholder="e.g. de87e461c06837f6" />
                        </div>
                    </div>
                </div>

                <div class="mt-8">
                    <BaseButton :loading="settingsStore.loading">Save Change</BaseButton>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>