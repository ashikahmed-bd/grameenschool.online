<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSectionStore } from '@/stores/section'

const route = useRoute()
const sectionStore = useSectionStore()

const emit = defineEmits(['created', 'cancel'])

const loading = ref(false)

const form = reactive({
  title: '',
})

const cancel = () => {
  emit('cancel')
}

const submit = async () => {
  const title = form.title.trim()
  if (!title || loading.value) return

  try {
    loading.value = true

    await sectionStore.store(route.params.id, { title })

    form.title = ''
    emit('created')
  } catch (error) {
    console.error('Create section failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="bg-slate-100 rounded-xl p-4">
    <input
      v-model="form.title"
      type="text"
      placeholder="Enter section title"
      class="bg-white w-full rounded px-3 py-2 text-sm border border-slate-300 outline-none"
    />

    <div class="mt-3 flex gap-2">
      <button
        type="submit"
        :disabled="loading"
        class="flex items-center gap-2 rounded bg-black px-4 py-2 text-xs text-white hover:bg-gray-800 disabled:opacity-50"
      >
        <span
          v-if="loading"
          class="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"
        ></span>
        {{ loading ? 'Creating...' : 'Create' }}
      </button>

      <button
        type="button"
        @click="cancel"
        class="rounded border px-4 py-2 text-xs hover:bg-gray-100"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
