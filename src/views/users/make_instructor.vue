<script setup>
import Default from '@/layouts/Default.vue'
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const route = useRoute()
const errors = ref([])

const form = reactive({
  university: '',
  department: '',
  designation: '',
  qualification: '',
  experience: '',
  specialization: '',
  bio: '',
})

const submit = async () => {
  await userStore.makeInstructor(route.params.id, form)
}
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Make Instructors</h3>
      </div>

      <div class="card__body max-w-3xl">
        <form @submit.prevent="submit">
          <div class="grid grid-cols-2 gap-4">
            <BaseInput
              label="University"
              v-model="form.university"
              placeholder="Enter university"
              :error="errors.university"
              :required="true"
            />

            <BaseInput
              label="Department"
              v-model="form.department"
              placeholder="Enter department"
              :error="errors.department"
              :required="true"
            />

            <BaseInput
              label="Designation"
              v-model="form.designation"
              placeholder="Enter designation"
              :error="errors.designation"
              :required="true"
            />

            <BaseInput
              label="Qualification"
              v-model="form.qualification"
              placeholder="Enter qualification"
              :error="errors.qualification"
              :required="true"
            />
            <BaseInput
              label="Experience"
              v-model="form.experience"
              placeholder="Enter experience"
              :error="errors.experience"
              :required="true"
            />
            <BaseInput
              label="Specialization"
              v-model="form.specialization"
              placeholder="Enter specialization"
              :error="errors.specialization"
              :required="true"
            />
          </div>

          <BaseTextarea label="Bio" v-model="form.bio" />

          <BaseButton :loading="userStore.loading">Make Instructor</BaseButton>
        </form>
      </div>
    </div>
  </Default>
</template>
