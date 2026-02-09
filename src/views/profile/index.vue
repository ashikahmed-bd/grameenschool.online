<script setup>
import Default from "@/layouts/Default.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useProfileStore} from "@/stores/profile.js";
import {useAuthStore} from "@/stores/auth.js";
import {reactive, onMounted} from "vue";

const authStore = useAuthStore();
const profileStore = useProfileStore();

const form = reactive({
  first_name: '',
  last_name: '',
  title: '',
  email: '',
  phone: '',
  username: '',
  about: '',
  avatar: '',
  avatar_preview: '',
});

const submit = async () => {
  const formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append('first_name', form.first_name);
  formData.append('last_name', form.last_name);
  formData.append('title', form.title);
  formData.append('email', form.email);
  formData.append('phone', form.phone);
  formData.append('username', form.username);
  formData.append('about', form.about);

  if (form.avatar) {
    formData.append('avatar', form.avatar);
  }

  await profileStore.update(formData);
  await getProfile();
}

const getProfile = async () => {
  const response = await profileStore.getProfile();
  form.first_name = response.data.first_name;
  form.last_name = response.data.last_name;
  form.title = response.data.title;
  form.email = response.data.email;
  form.phone = response.data.phone;
  form.username = response.data.username;
  form.about = response.data.about;
  form.avatar_preview = response.data.avatar_url;
}


onMounted( () => {
  getProfile();
});

</script>

<template>
 <Default>
   <div class="bg-white shadow rounded-xl p-6">
     <form @submit.prevent="submit" enctype="multipart/form-data">
       <div class="flex items-center mb-6">
         <a href="#" class="w-24 h-24 rounded-full border overflow-hidden mr-4 shrink-0">
           <img :src="form.avatar_preview" alt="Avatar" class="object-cover w-full h-full">
         </a>
         <div>
           <h6 class="text-lg font-semibold">{{authStore.user?.name}}</h6>
           <p class="text-sm text-gray-500">PNG or JPG no bigger than 800px width and height</p>
           <div class="flex items-center mt-2 space-x-2">
             <label class="relative cursor-pointer">
               <input type="file" @change="e => form.avatar = e.target.files[0]" class="hidden">
               <span class="inline-block px-3 py-1 text-sm bg-gray-100 rounded-full">Upload</span>
             </label>
             <button class="px-3 py-1 text-sm bg-gray-300 rounded-full">Delete</button>
           </div>
         </div>
       </div>

       <div class="mb-6">
         <h5 class="text-xl font-semibold mb-1">Personal Details</h5>
         <p class="text-gray-500">Edit your personal information</p>
       </div>
       <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div class="form__group">
           <label class="form__label">First Name <span class="text-red-500">*</span></label>
           <input type="text" v-model="form.first_name" class="form__control">
         </div>
         <div class="form__group">
           <label class="form__label">Last Name <span class="text-red-500">*</span></label>
           <input type="text" v-model="form.last_name" class="form__control">
         </div>
         <div class="form__group">
           <label class="form__label">Title <span class="text-red-500">*</span></label>
           <input type="text" v-model="form.title" class="form__control">
         </div>
         <div class="form__group">
           <label class="form__label">Email <span class="text-red-500">*</span></label>
           <input type="text" v-model="form.email" class="form__control">
         </div>
         <div class="form__group">
           <label class="form__label">Phone Number <span class="text-red-500">*</span></label>
           <input type="text" v-model="form.phone" class="form__control">
         </div>
         <div class="form__group">
           <label class="form__label">Username <span class="text-red-500">*</span></label>
           <input type="text" v-model="form.username" class="form__control">
         </div>
         <div class="form__group md:col-span-2">
           <label class="form__label">Bio <span class="text-red-500">*</span></label>
           <textarea rows="4" v-model="form.about" class="form__control" placeholder="I am a web developer..."></textarea>
         </div>
       </div>

       <div class="form__group">
         <BaseButton :loading="profileStore.loading">Update Profile</BaseButton>
       </div>

     </form>
   </div>
 </Default>
</template>
