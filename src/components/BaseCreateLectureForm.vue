<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['cancel'])

const form = reactive({
  title: '',
  busy: false,
  errors: {},
})

function submit() {
  form.busy = true

  // API CALL HERE
  setTimeout(() => {
    form.busy = false
    form.title = ''
  }, 500)
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <div class="bg-white border border-slate-800">
    <form @submit.prevent="submit" class="p-4">
      <div>
        <label class="block text-sm font-medium mb-1"> Lecture title </label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border border-slate-400 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Enter lecture title"
        />

        <p v-if="form.errors?.title" class="text-red-600 text-sm mt-1">
          {{ form.errors.title }}
        </p>
      </div>

      <div class="my-4 flex justify-end gap-4">
        <button
          type="button"
          @click="cancel"
          :disabled="form.busy"
          class="border border-red-600 text-red-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="form.busy"
          class="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Add lecture
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
