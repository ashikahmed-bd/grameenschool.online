<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLectureStore } from '@/stores/lecture'

const route = useRoute()
const lectureStore = useLectureStore()

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  lecture: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['created', 'updated', 'cancel'])

const loading = ref(false)

const form = reactive({
  title: '',
})

const isEditing = computed(() => !!props.lecture?.id)

watch(
  () => props.lecture,
  (lecture) => {
    form.title = lecture?.title || ''
  },
  { immediate: true },
)

const resetForm = () => {
  form.title = ''
}

const cancelForm = () => {
  resetForm()
  emit('cancel')
}

const submit = async () => {
  const title = form.title.trim()
  if (!title || loading.value) return

  loading.value = true

  try {
    if (isEditing.value) {
      await lectureStore.update(route.params.id, props.lecture.id, { title })
      emit('updated')
    } else {
      await lectureStore.store(route.params.id, props.section.id, { title })
      resetForm()
      emit('created')
    }
  } catch (error) {
    console.error(isEditing.value ? 'Update failed:' : 'Create failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="rounded-xl bg-white p-4">
    <form @submit.prevent="submit" class="space-y-3">
      <input
        v-model="form.title"
        type="text"
        :placeholder="isEditing ? 'Update lecture title' : 'Enter lecture title'"
        class="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none"
      />

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="cancelForm"
          :disabled="loading"
          class="rounded bg-gray-400 px-3 py-2 text-xs text-white disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="loading"
          class="rounded bg-primary px-3 py-2 text-xs text-white disabled:opacity-50"
        >
          {{
            loading ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update' : 'Create'
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
