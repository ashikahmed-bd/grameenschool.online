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
import { useReferralStore } from '@/stores/referral'
import BaseTextarea from '@/components/BaseTextarea.vue'

const route = useRoute()
const referralStore = useReferralStore()
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
  instructor: {
    university: '',
    department: '',
    designation: '',
    qualification: '',
    experience: '',
    specialization: '',
    bio: '',
  },
  student: {
    university: '',
    department: '',
    session: '',
  },
})

const referral = reactive({
  user_id: route.params.id,
  code: '',
  commission: '',
  discount: '',
  status: '',
})
const updateReferral = async () => {
  await referralStore.update(referral)
}

const loadUser = async () => {
  const { data } = await userStore.show(route.params.id)

  form.name = data.name
  form.phone = data.phone
  form.email = data.email
  form.username = data.username
  form.role = data.role
  form.active = data.active

  // Instructor assignment
  if (data.instructor) {
    form.instructor.university = data.instructor.university || ''
    form.instructor.department = data.instructor.department || ''
    form.instructor.designation = data.instructor.designation || ''
    form.instructor.qualification = data.instructor.qualification || ''
    form.instructor.experience = data.instructor.experience || ''
    form.instructor.specialization = data.instructor.specialization || ''
    form.instructor.bio = data.instructor.bio || ''
  }

  // Student assignment
  if (data.student) {
    form.student.university = data.student.university || ''
    form.student.department = data.student.department || ''
    form.student.session = data.student.session || ''
  }

  // Referral info
  referral.code = data?.referral?.code || ''
  referral.commission = data?.referral?.commission || ''
  referral.discount = data?.referral?.discount || ''
  referral.status = data?.referral?.status || ''
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

  // Only send instructor if role is instructor
  if (form.role === 'instructor') {
    formData.append('instructor[university]', form.instructor.university)
    formData.append('instructor[department]', form.instructor.department)
    formData.append('instructor[designation]', form.instructor.designation)
    formData.append('instructor[qualification]', form.instructor.qualification)
    formData.append('instructor[experience]', form.instructor.experience)
    formData.append('instructor[specialization]', form.instructor.specialization)
    formData.append('instructor[bio]', form.instructor.bio)
  }

  // Optionally send student fields if role is student
  if (form.role === 'student') {
    formData.append('student[university]', form.student.university)
    formData.append('student[department]', form.student.department)
    formData.append('student[session]', form.student.session)
  }

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
              <BaseInput
                label="Full Name"
                v-model="form.name"
                placeholder="Enter Name"
                :error="errors.name"
                :required="true"
              />

              <BaseInput
                label="Email"
                v-model="form.email"
                placeholder="Enter email"
                :error="errors.email"
                :required="true"
              />

              <BaseInput
                label="Phone"
                v-model="form.phone"
                placeholder="Enter Phone"
                :error="errors.phone"
                :required="true"
              />

              <BaseInput
                label="Username"
                v-model="form.username"
                placeholder="Enter username"
                :error="errors.username"
                :required="true"
              />

              <BaseSelect
                v-model="form.active"
                label="Active"
                :options="[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]"
                :error="errors.active"
                :required="true"
              />

              <BaseFile
                @change="(e) => (form.avatar = e.target.files[0])"
                label="Upload Avatar"
                name="Avatar"
                accept="image/*"
                :error="errors.avatar"
              />
            </div>

            <template v-if="form.role === 'instructor'">
              <div class="grid grid-cols-3 gap-4">
                <BaseInput
                  label="University"
                  v-model="form.instructor.university"
                  placeholder="Enter university"
                  :error="errors.university"
                  :required="true"
                />

                <BaseInput
                  label="Department"
                  v-model="form.instructor.department"
                  placeholder="Enter department"
                  :error="errors.department"
                  :required="true"
                />

                <BaseInput
                  label="Designation"
                  v-model="form.instructor.designation"
                  placeholder="Enter designation"
                  :error="errors.designation"
                  :required="true"
                />

                <BaseInput
                  label="Qualification"
                  v-model="form.instructor.qualification"
                  placeholder="Enter qualification"
                  :error="errors.qualification"
                  :required="true"
                />
                <BaseInput
                  label="Experience"
                  v-model="form.instructor.experience"
                  placeholder="Enter experience"
                  :error="errors.experience"
                  :required="true"
                />
                <BaseInput
                  label="Specialization"
                  v-model="form.instructor.specialization"
                  placeholder="Enter specialization"
                  :error="errors.specialization"
                  :required="true"
                />
              </div>

              <BaseTextarea label="Bio" v-model="form.instructor.bio" />
            </template>

            <BaseButton :loading="userStore.loading">Submit</BaseButton>
          </form>

          <form @submit.prevent="updateReferral">
            <BaseInput
              label="Referral Code"
              v-model="referral.code"
              placeholder="Enter Referral Code"
              :error="errors.referral_code"
              :required="true"
            />
            <BaseInput
              label="Commission %"
              type="number"
              v-model="referral.commission"
              placeholder="Enter Commission %"
              :error="errors.commission"
              :required="true"
            />
            <BaseInput
              label="Discount %"
              type="number"
              v-model="referral.discount"
              placeholder="Enter Discount %"
              :error="errors.discount"
              :required="true"
            />
            <BaseSelect
              v-model="referral.status"
              label="Status"
              :options="[
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
              ]"
              :error="errors.status"
              :required="true"
            />

            <BaseButton :loading="referralStore.loading" class="w-full">Update</BaseButton>
          </form>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
