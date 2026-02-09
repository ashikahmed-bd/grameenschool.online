<script setup>
import BaseButton from '@/components/BaseButton.vue';
import { reactive, onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();
const { errors } = storeToRefs(settingsStore);


const form = reactive({
  phone: '',
  email: '',
  address: '',
  whatsapp: '',
  facebook: '',
  twitter: '',
  linkedin: '',
  youtube: '',

});

const loadContact = async () => {
  const response = await settingsStore.getContact();
  form.phone = response.contact.phone;
  form.email = response.contact.email;
  form.address = response.contact.address;
  form.whatsapp = response.contact.whatsapp;
  form.facebook = response.contact.facebook;
  form.twitter = response.contact.twitter;
  form.linkedin = response.contact.linkedin;
  form.youtube = response.contact.youtube;
}

const submit = async () => {
  await settingsStore.contact(form);
}


onMounted(() => {
  loadContact();
})

</script>

<template>
  <div class="space-y-2 mb-6">
    <div class="mb-6">
      <h2 class="text-2xl font-semibold">Contact Us</h2>
      <p class="text-sm text-gray-500 mt-1">
        Have any questions or need help? Fill out the form below and we’ll get back to you shortly.
      </p>
    </div>

    <div class="w-full max-w-2xl">
      <form @submit.prevent="submit">
        <!-- Phone -->
        <div class="form__group">
          <label class="form__label">Phone Number</label>
          <input type="text" v-model="form.phone" class="form__control" placeholder="e.g. +8801XXXXXXXXX" />
        </div>

        <!-- Email -->
        <div class="form__group">
          <label class="form__label">Email Address</label>
          <input type="email" v-model="form.email" class="form__control" placeholder="e.g. contact@example.com" />
        </div>

        <!-- Address -->
        <div class="form__group">
          <label class="form__label">Physical Address</label>
          <input type="text" v-model="form.address" class="form__control" placeholder="e.g. 123 Main Street, Dhaka" />
        </div>

        <!-- WhatsApp -->
        <div class="form__group">
          <label class="form__label">WhatsApp Number</label>
          <input type="text" v-model="form.whatsapp" class="form__control" placeholder="e.g. +8801XXXXXXXXX" />
        </div>

        <!-- Facebook -->
        <div class="form__group">
          <label class="form__label">Facebook Page URL</label>
          <input type="text" v-model="form.facebook" class="form__control"
            placeholder="e.g. https://facebook.com/yourpage" />
        </div>

        <!-- Twitter -->
        <div class="form__group">
          <label class="form__label">Twitter Profile URL</label>
          <input type="text" v-model="form.twitter" class="form__control"
            placeholder="e.g. https://twitter.com/yourhandle" />
        </div>

        <!-- LinkedIn -->
        <div class="form__group">
          <label class="form__label">LinkedIn Profile/Page</label>
          <input type="text" v-model="form.linkedin" class="form__control"
            placeholder="e.g. https://linkedin.com/in/yourname" />
        </div>

        <!-- YouTube -->
        <div class="form__group">
          <label class="form__label">YouTube Channel URL</label>
          <input type="text" v-model="form.youtube" class="form__control"
            placeholder="e.g. https://youtube.com/@yourchannel" />
        </div>
 
        <div class="form__group mt-4">
          <BaseButton :loading="settingsStore.loading">Save Change</BaseButton>
        </div>
      </form>

    </div>
  </div>
</template>

<style scoped></style>