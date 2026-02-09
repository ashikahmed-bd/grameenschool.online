<script setup>
import { ref } from 'vue'
import IconDocument from './icons/IconDocument.vue'
import BaseButton from './BaseButton.vue'
import QuillEditor from './QuillEditor.vue'
const props = defineProps({
  lecture: {
    type: Object,
    required: true,
  },
})

const isEditing = ref(false)
const showVideoPicker = ref(false)
</script>

<template>
  <div class="bg-white">
    <!-- ================= EDIT ARTICLE ================= -->
    <template v-if="isEditing">
      <form @submit="">
        <QuillEditor />
        <BaseButton type="submit">Save Article</BaseButton>
      </form>
    </template>

    <!-- ================= VIDEO PICKER ================= -->
    <div v-else-if="showVideoPicker" class="p-4">
      <BaseVideoContentForm :lecture="lecture" @cancel="showVideoPicker = false" />
    </div>

    <!-- CONTENT SUMMARY -->
    <div v-else class="flex gap-4">
      <div class="flex items-center justify-center bg-gray-700 text-white w-20 h-20 rounded">
        <IconDocument class="size-12" />
      </div>

      <div class="space-y-1 text-sm">
        <div>{{ lecture.duration?.hms }}</div>

        <button
          @click="isEditing = true"
          class="flex items-center gap-1 border px-2 py-1 rounded text-xs hover:bg-slate-100"
        >
          Edit content
        </button>

        <button
          @click="showVideoPicker = true"
          class="flex items-center gap-1 border px-2 py-1 rounded text-xs hover:bg-slate-100"
        >
          Replace with video
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
