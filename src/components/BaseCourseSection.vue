<script setup>
import { ref, reactive } from 'vue'
import IconEdit from './icons/IconEdit.vue'
import IconMove from './icons/IconMove.vue'
import BaseCreateLectureForm from './BaseCreateLectureForm.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const isEditing = ref(false)
const createLectureForm = ref(false)

const form = reactive({
  title: props.section.title,
  busy: false,
  errors: {},
})

function submit() {
  form.busy = true

  // API CALL HERE
  setTimeout(() => {
    form.busy = false
    isEditing.value = false
  }, 500)
}

function cancelEdit() {
  isEditing.value = false
}

function deleteSection() {
  console.log('delete section', props.section.id)
}
</script>

<template>
  <div class="bg-slate-100 border border-slate-800 rounded">
    <!-- SECTION HEADER ================= -->
    <div v-if="!isEditing" class="flex justify-between gap-4 p-4 cursor-move group">
      <span class="text-lg">
        <b>Section {{ section.sort_order }}:</b>
        {{ section.title }}
      </span>

      <div class="flex gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button v-if="section.can_trash" @click="deleteSection" class="hover:scale-110">🗑</button>
        <button @click="isEditing = true" class="hover:scale-110">
          <IconEdit class="size-5" />
        </button>
        <button class="cursor-move hover:scale-110"><IconMove class="size-5" /></button>
      </div>
    </div>

    <!-- EDIT MODE -->
    <div v-else class="bg-white p-4">
      <form @submit.prevent="submit">
        <div class="my-4">
          <input
            v-model="form.title"
            class="w-full border border-slate-400 px-3 py-2 rounded"
            placeholder="Section title"
          />
          <p v-if="form.errors?.title" class="text-red-600 text-sm mt-1">
            {{ form.errors.title }}
          </p>
        </div>

        <div class="my-4 flex justify-end gap-4">
          <button type="button" @click="cancelEdit" disabled="" class="border px-4 py-2 rounded">
            Cancel
          </button>
          <button type="submit" disabled="" class="bg-black text-white px-4 py-2 rounded">
            Update
          </button>
        </div>
      </form>
    </div>

    <!-- LECTURES SLOT -->
    <div class="space-y-4 p-4">
      <slot />
    </div>

    <!-- CREATE LECTURE -->
    <div class="p-4">
      <div v-if="!createLectureForm" class="text-right">
        <button
          @click="createLectureForm = true"
          class="inline-flex items-center gap-1 bg-black text-white px-4 py-2 rounded"
        >
          Create lecture
        </button>
      </div>

      <BaseCreateLectureForm v-else :section="section" @cancel="createLectureForm = false" />
    </div>
  </div>
</template>

<style scoped></style>
