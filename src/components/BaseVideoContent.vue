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
const loading = ref(false)

const form = reactive({
  video_id: props.lecture?.video.video_id || '',
  provider: props.lecture?.video.provider || '',
})

const submit = async () => {
  loading.value = true

  try {
    await lectureStore.video(route.params.id, props.lecture.id, form)
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
        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700"> Video ID </label>
            <input
              type="text"
              v-model="form.video_id"
              placeholder="Enter YouTube or Vimeo ID"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700"> Provider </label>
            <select
              v-model="form.provider"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </select>
          </div>
        </div>

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
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-12 text-white"
          >
            <path
              d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
            />
          </svg>
        </div>

        <div class="space-y-2 text-sm">
          <h4 class="font-semibold">Big Buck Bunny</h4>
          <span class="text-gray-600">
            {{ lecture.duration?.hms }}
          </span>

          <div class="space-y-2">
            <button
              @click="editing = true"
              class="block rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
              Edit Content
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
