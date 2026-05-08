<script setup>
import { reactive, ref } from 'vue'
import IconDocument from './icons/IconDocument.vue'
import IconPlay from './icons/IconPlay.vue'
import { useLectureStore } from '@/stores/lecture'
import { useRoute } from 'vue-router'

const route = useRoute()
const lectureStore = useLectureStore()

const props = defineProps({
  lecture: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['saved', 'cancel'])

const loading = ref(false)

const form = reactive({
  type: 'video',
  body: '',
  video_id: '',
  provider: 'youtube',
})

const submit = async () => {
  loading.value = true

  try {
    let response

    if (form.type === 'article') {
      response = await lectureStore.article(route.params.id, props.lecture.id, {
        body: form.body,
      })
    } else {
      response = await lectureStore.video(route.params.id, props.lecture.id, {
        video_id: form.video_id,
        provider: form.provider,
      })
    }

    emit('saved', response)
  } catch (error) {
    console.error('Failed to save content:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="rounded-xl bg-white p-4">
    <form @submit.prevent="submit" class="space-y-4">
      <div class="flex items-center justify-center gap-4">
        <button type="button" @click="form.type = 'article'" :class="form.type === 'article'
            ? 'border-primary bg-primary/5'
            : 'border-slate-200 bg-white hover:border-slate-300'
          " class="rounded-xl border p-4 text-center transition">
          <div class="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <IconDocument class="size-6" />
          </div>
          <span class="text-sm font-semibold text-slate-800">Article</span>
        </button>

        <button type="button" @click="form.type = 'video'" :class="form.type === 'video'
            ? 'border-primary bg-primary/5'
            : 'border-slate-200 bg-white hover:border-slate-300'
          " class="rounded-xl border p-4 text-center transition">
          <div class="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <IconPlay class="size-6" />
          </div>
          <span class="text-sm font-semibold text-slate-800">Video</span>
        </button>
      </div>

      <template v-if="form.type === 'video'">

        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600">Video ID</label>
          <input v-model="form.video_id" type="text" placeholder="Enter video ID"
            class="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none" />
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600">Provider</label>
          <select v-model="form.provider" class="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none">
            <option value="youtube">Youtube</option>
            <option value="vimeo">Vimeo</option>
          </select>
        </div>
      </template>

      <template v-else>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600">Description</label>
          <textarea v-model="form.body" rows="4" placeholder="Write lecture content description"
            class="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none" />
        </div>
      </template>

      <div class="flex justify-end gap-2">
        <button type="button" @click="$emit('cancel')" :disabled="loading"
          class="rounded bg-gray-400 px-3 py-2 text-xs text-white disabled:opacity-50">
          Cancel
        </button>

        <button type="submit" :disabled="loading"
          class="rounded bg-primary px-3 py-2 text-xs text-white disabled:opacity-50">
          {{ loading ? 'Saving...' : 'Save Content' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
