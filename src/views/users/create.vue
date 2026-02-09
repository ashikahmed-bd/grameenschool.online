<script setup>
import Default from '@/layouts/Default.vue'
import { useUserStore } from '@/stores/user.js'
import { reactive } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

const router = useRouter()
const userStore = useUserStore()
const { errors } = storeToRefs(userStore)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
  username: '',
  role: '',
  avatar: '',
  active: '',
})

const submit = async () => {
  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('phone', form.phone)
  formData.append('email', form.email)
  formData.append('password', form.password)
  formData.append('username', form.username)
  formData.append('role', form.role)
  formData.append('active', form.active)

  if (form.avatar) {
    formData.append('avatar', form.avatar)
  }
  await userStore.store(formData, router)
}
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Create User</h3>
        <RouterLink :to="{ name: 'users' }" class="base__button">All Users</RouterLink>
      </div>

      <div class="card__body">
        <form @submit.prevent="submit" enctype="multipart/form-data">
          <div class="grid grid-cols-3 gap-12">
            <div class="w-full col-span-2">
              <div class="grid grid-cols-2 gap-4">
                <BaseInput
                  label="Full Name"
                  id="name"
                  name="name"
                  v-model="form.name"
                  placeholder="Enter name"
                  :error="errors.name"
                  required
                />
                <BaseInput
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  v-model="form.phone"
                  placeholder="Enter phone"
                  :error="errors.phone"
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <BaseInput
                  label="Email Address"
                  id="email"
                  name="email"
                  v-model="form.email"
                  placeholder="Enter email"
                  :error="errors.email"
                  required
                />

                <BaseInput
                  label="Password"
                  id="password"
                  type="password"
                  name="password"
                  v-model="form.password"
                  placeholder="Enter password"
                  :error="errors.password"
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <BaseInput
                  label="Username"
                  id="username"
                  name="username"
                  v-model="form.username"
                  placeholder="Enter username"
                  :error="errors.username"
                  required
                />

                <BaseSelect
                  v-model="form.role"
                  label="Role"
                  :options="[
                    { label: 'Admin', value: 'admin' },
                    { label: 'Author', value: 'author' },
                  ]"
                  :error="errors.role"
                  :required="true"
                />

                <BaseSelect
                  v-model="form.active"
                  label="Active"
                  :options="[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ]"
                  :error="errors.role"
                  :required="true"
                />

                <div class="form__group">
                  <label class="form__label">Avatar</label>
                  <input
                    type="file"
                    @change="(e) => (form.avatar = e.target.files[0])"
                    class="form__file"
                  />
                </div>
              </div>
            </div>
          </div>
          <BaseButton :loading="userStore.loading">Submit</BaseButton>
        </form>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
