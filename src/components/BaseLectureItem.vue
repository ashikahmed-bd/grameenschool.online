<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLectureStore } from '@/stores/lecture'

import IconPlay from './icons/IconPlay.vue'
import IconDocument from './icons/IconDocument.vue'
import IconCircleCheck from './icons/IconCircleCheck.vue'
import IconCircle from './icons/IconCircle.vue'
import IconDelete from './icons/IconDelete.vue'
import IconEdit from './icons/IconEdit.vue'
import IconChevronRight from './icons/IconChevronRight.vue'
import BaseLectureContentForm from './BaseLectureContentForm.vue'
import BaseArticleContent from './BaseArticleContent.vue'
import BaseVideoContent from './BaseVideoContent.vue'

const route = useRoute()
const lectureStore = useLectureStore()

const props = defineProps({
  lecture: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updated', 'deleted'])

const expanded = ref(false)
const editing = ref(false)
const showContentForm = ref(false)
const loading = ref(false)

const form = reactive({
  title: '',
})

const resetForm = () => {
  form.title = props.lecture?.title || ''
}

const cancelForm = () => {
  resetForm()
  editing.value = false
  expanded.value = false
}

const submit = async () => {
  const title = form.title.trim()
  if (!title || loading.value) return

  try {
    loading.value = true
    await lectureStore.update(route.params.id, props.lecture.id, { title })
    emit('updated')
    cancelForm()
  } catch (error) {
    console.error('Lecture update failed:', error)
  } finally {
    loading.value = false
  }
}

const lectureDelete = async () => {
  if (loading.value) return
  if (!confirm('Are you sure you want to delete this lecture?')) return

  try {
    loading.value = true
    await lectureStore.delete(route.params.id, props.lecture.id)
    emit('deleted')
  } catch (error) {
    console.error('Lecture delete failed:', error)
  } finally {
    loading.value = false
  }
}

const handleContentSaved = () => {
  showContentForm.value = false
  emit('updated')
}

const closeExpanded = () => {
  showContentForm.value = false
}

watch(
  () => props.lecture,
  () => {
    resetForm()
  },
  { immediate: true, deep: true },
)

const openContentForm = () => {
  showContentForm.value = true
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white transition">
    <div class="group flex items-center justify-between px-4 py-2">
      <div class="flex min-w-0 items-center gap-3">
        <div class="shrink-0">
          <IconCircleCheck v-if="lecture.has_content" class="size-5 text-green-600" />
          <IconCircle v-else class="size-5 text-slate-400" />
        </div>

        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
        >
          <IconPlay v-if="lecture.type === 'video'" class="size-4" />
          <IconDocument v-else class="size-4" />
        </div>

        <div class="min-w-0">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-500">
            Lecture: {{ lecture.sort_order }}
          </p>
          <h3 class="truncate text-sm font-semibold text-slate-800">
            {{ lecture.title }}
          </h3>
        </div>
      </div>

      <div class="ml-4 flex shrink-0 items-center gap-2">
        <div
          class="flex items-center gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100"
          @click.stop
        >
          <button
            type="button"
            @click="editing = !editing"
            class="rounded p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <IconEdit class="size-4" />
          </button>

          <button
            type="button"
            @click="lectureDelete"
            :disabled="loading"
            class="rounded p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <IconDelete class="size-4" />
          </button>
          <button
            v-if="!lecture.has_content"
            type="button"
            @click="openContentForm"
            class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Add content
          </button>
        </div>

        <button
          type="button"
          class="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100"
          @click.stop="expanded = !expanded"
        >
          <IconChevronRight
            class="size-5 transition duration-200"
            :class="{ 'rotate-90': expanded }"
          />
        </button>
      </div>
    </div>

    <div v-if="editing" class="border-t border-slate-200 bg-white p-4">
      <form @submit.prevent="submit" class="space-y-3">
        <input
          v-model="form.title"
          type="text"
          placeholder="Enter lecture title"
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
            {{ loading ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </form>
    </div>

    <BaseLectureContentForm
      v-if="showContentForm"
      :lecture="lecture"
      @saved="handleContentSaved"
      @cancel="closeExpanded"
    />

    <div v-if="expanded" class="p-4">
      <template v-if="lecture.type === 'text'">
        <BaseArticleContent :lecture="lecture" />
      </template>

      <template v-else>
        <BaseVideoContent :lecture="lecture" />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
