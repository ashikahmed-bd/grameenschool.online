<script setup>
import { ref, watch } from 'vue'
import IconPlay from './icons/IconPlay.vue'
import IconDocument from './icons/IconDocument.vue'
import QuillEditor from './QuillEditor.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  lecture: Object,
  expanded: Boolean,
})

const selectedContentType = ref(null)

watch(
  () => props.expanded,
  (expanded) => {
    if (!expanded) selectedContentType.value = null
  },
)

const cancel = () => {
  selectedContentType.value = null
}
</script>

<template>
  <div class="border border-slate-200 p-4 rounded">
    <div v-if="selectedContentType === 'ARTICLE'">
      <form @submit="">
        <QuillEditor />
        <div class="flex items-center gap-2">
          <button @click="cancel" type="reset" class="bg-gray-700 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <BaseButton type="submit">Save Article</BaseButton>
        </div>
      </form>
    </div>
    <div v-else-if="selectedContentType === 'VIDEO'">
      <form class="">
        <label class="block mb-4">
          <input
            type="file"
            ref="uploader"
            :multiple="false"
            accept="video/*"
            class="block !cursor-pointer w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
        <div class="flex items-center gap-2">
          <button @click="cancel" type="reset" class="bg-gray-700 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <BaseButton type="submit">Upload</BaseButton>
        </div>
      </form>
    </div>
    <div v-else class="flex justify-center gap-6 text-center">
      <button
        @click="selectedContentType = 'VIDEO'"
        class="flex flex-col items-center gap-2 border border-slate-400 p-4 rounded hover:bg-slate-100"
      >
        <div class="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full">
          <IconPlay class="w-6 h-6" />
        </div>
        <div class="text-sm">Video</div>
      </button>

      <button
        @click="selectedContentType = 'ARTICLE'"
        class="flex flex-col items-center gap-2 border border-slate-400 p-4 rounded hover:bg-slate-100"
      >
        <div class="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full">
          <IconDocument class="w-6 h-6" />
        </div>
        <div class="text-sm">Article</div>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
