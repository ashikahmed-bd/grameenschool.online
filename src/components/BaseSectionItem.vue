<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSectionStore } from '@/stores/section'
import BaseLectureForm from './BaseLectureForm.vue'

const route = useRoute()
const sectionStore = useSectionStore()

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['deleted', 'reloaded'])

const editing = ref(false)
const loading = ref(false)
const showLectureForm = ref(false)

const form = reactive({
  title: '',
})

const resetForm = () => {
  form.title = props.section?.title || ''
}

const openEdit = () => {
  resetForm()
  editing.value = true
}

const cancelEdit = () => {
  resetForm()
  editing.value = false
}

const submit = async () => {
  const title = form.title.trim()
  if (!title || loading.value) return

  try {
    loading.value = true
    await sectionStore.update(route.params.id, props.section.id, { title })
    editing.value = false
    emit('reloaded')
  } catch (error) {
    console.error('Section update failed:', error)
  } finally {
    loading.value = false
  }
}

const deleteSection = () => {
  emit('deleted', props.section)
}

const handleLectureCreated = () => {
  showLectureForm.value = false
  emit('reloaded')
}

watch(
  () => props.section,
  () => {
    resetForm()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="space-y-3 rounded-xl border border-slate-300 bg-slate-100 p-4">
    <template v-if="editing">
      <div class="rounded-xl bg-white">
        <form @submit.prevent="submit">
          <div class="flex items-center justify-between gap-3 bg-gray-50 px-4 py-3">
            <div class="flex-1">
              <input
                v-model="form.title"
                type="text"
                placeholder="Section title"
                class="w-full rounded border border-gray-200 px-2 py-1.5 text-sm outline-none"
              />
            </div>

            <div class="ml-3 flex gap-2">
              <button
                type="submit"
                :disabled="loading"
                class="rounded bg-primary px-3 py-2 text-xs text-white disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : 'Save' }}
              </button>

              <button
                type="button"
                :disabled="loading"
                @click="cancelEdit"
                class="rounded bg-gray-400 px-3 py-2 text-xs text-white disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </template>

    <template v-else>
      <div class="group flex cursor-move justify-between gap-4 py-2">
        <div>
          <h3 class="text-sm font-semibold">
            {{ props.section.sort_order }}: {{ props.section.title }}
          </h3>
          <p class="text-xs text-gray-500">{{ props.section.lectures?.length || 0 }} lectures</p>
        </div>

        <div
          class="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <button
            type="button"
            @click="openEdit"
            class="rounded bg-blue-500 px-2 py-1 text-xs text-white"
          >
            Edit
          </button>

          <button
            type="button"
            @click="deleteSection"
            :disabled="loading"
            class="rounded bg-red-500 px-2 py-1 text-xs text-white disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </template>

    <slot />

    <BaseLectureForm
      v-if="showLectureForm"
      :section="section"
      @created="handleLectureCreated"
      @cancel="showLectureForm = false"
    />

    <div class="text-end">
      <button
        type="button"
        @click="showLectureForm = true"
        class="rounded bg-black px-4 py-2 text-xs text-white hover:bg-gray-800"
      >
        Create Lecture
      </button>
    </div>
  </div>
</template>

<style scoped></style>
