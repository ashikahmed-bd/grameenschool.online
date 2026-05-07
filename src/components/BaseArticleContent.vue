<script setup>
import { useLectureStore } from '@/stores/lecture'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const lectureStore = useLectureStore()

const props = defineProps({
  lecture: {
    type: Object,
    required: true,
  },
})

const editing = ref(false)
const showVideoPicker = ref(false)
const loading = ref(false)

const form = reactive({
  body: props.lecture?.body || '',
})

const submit = async () => {
  loading.value = true

  try {
    await lectureStore.article(route.params.id, props.lecture.id, form)
    editing.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <template v-if="editing">
      <form @submit.prevent="submit" class="space-y-2">
        <textarea
          v-model="form.body"
          rows="4"
          class="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring focus:ring-gray-200"
        ></textarea>

        <div class="space-x-2">
          <button
            type="submit"
            :disabled="loading"
            class="rounded bg-gray-800 px-3 py-1 text-xs text-white"
          >
            <span v-if="loading">Saving...</span>
            <span v-else>Save</span>
          </button>

          <button @click="editing = false" class="rounded border border-gray-300 px-3 py-1 text-xs">
            Cancel
          </button>
        </div>
      </form>
    </template>
    <template v-else>
      <div class="flex gap-4">
        <div class="flex items-center justify-center rounded border border-gray-300 bg-black p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="size-12 text-white"
          >
            <path
              d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
            />
            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
          </svg>
        </div>

        <div class="space-y-2 text-sm w-full">
          <div class="text-gray-600">
            {{ lecture.duration?.hms || '00:00' }}
          </div>

          <div class="space-y-2">
            <button
              @click="editing = true"
              class="block rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>

            <button
              @click="showVideoPicker = true"
              class="block rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
              Replace With Video
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
