<script setup>
import Default from '@/layouts/Default.vue'
import { useUserStore } from '@/stores/user.js'
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import { storeToRefs } from 'pinia'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseFile from '@/components/BaseFile.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'

const route = useRoute()
const userStore = useUserStore()
const { errors } = storeToRefs(userStore)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  username: '',
  avatar: '',
  role: '',
  active: '',
})


const loadUser = async () => {
  const { data } = await userStore.show(route.params.id)

  form.name = data.name
  form.phone = data.phone
  form.email = data.email
  form.username = data.username
  form.role = data.role
  form.active = data.active
}

const submit = async () => {
  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('phone', form.phone)
  formData.append('email', form.email)
  formData.append('username', form.username)
  formData.append('role', form.role)
  formData.append('active', form.active)

  if (form.avatar) formData.append('avatar', form.avatar)

  await userStore.update(route.params.id, formData)
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Update User</h3>
        <RouterLink :to="{ name: 'users' }" class="base__button">All Users</RouterLink>
      </div>

      <div class="card__body">
        <div class="grid grid-cols-3 gap-8">
          <form @submit.prevent="submit" class="col-span-2">
            <div class="grid grid-cols-2 gap-4">
              <BaseInput label="Full Name" v-model="form.name" placeholder="Enter Name" :error="errors.name"
                :required="true" />

              <BaseInput label="Email" v-model="form.email" placeholder="Enter email" :error="errors.email"
                :required="true" />

              <BaseInput label="Phone" v-model="form.phone" placeholder="Enter Phone" :error="errors.phone"
                :required="true" />

              <BaseInput label="Username" v-model="form.username" placeholder="Enter username" :error="errors.username"
                :required="true" />

              <BaseSelect v-model="form.active" label="Active" :options="[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ]" :error="errors.active" :required="true" />

              <BaseFile @change="(e) => (form.avatar = e.target.files[0])" label="Upload Avatar" name="Avatar"
                accept="image/*" :error="errors.avatar" />
            </div>

            <BaseButton :loading="userStore.loading">Submit</BaseButton>
          </form>

        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
