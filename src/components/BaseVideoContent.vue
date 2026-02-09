<script setup>
import { ref } from 'vue'
import IconPlay from './icons/IconPlay.vue'
import BaseButton from './BaseButton.vue'
const props = defineProps({
  lecture: {
    type: Object,
    required: true,
  },
})

const isEditing = ref(false)
</script>

<template>
  <div class="bg-white">
    <!-- VIEW MODE -->
    <template v-if="!isEditing">
      <div class="flex gap-4">
        <div class="flex items-center justify-center bg-gray-700 text-white w-20 h-20 rounded">
          <IconPlay class="size-12" />
        </div>

        <div class="space-y-1 text-sm">
          <div>{{ lecture.video?.filename }}</div>
          <div>{{ lecture.duration?.hms }}</div>

          <div v-if="lecture.video?.status !== 'processing'">
            <button
              @click="isEditing = true"
              class="flex items-center gap-1 border px-2 py-1 rounded text-xs hover:bg-slate-100"
            >
              Edit content
            </button>
          </div>
        </div>
      </div>

      <!-- PROCESSING -->
      <div v-if="lecture.video?.status === 'processing'" class="mt-3 text-sm">
        <div class="mb-1">{{ lecture.video?.status }} ({{ lecture.video?.percent }}%)</div>

        <div class="w-full bg-gray-200 rounded h-2 overflow-hidden">
          <div
            class="bg-green-600 h-full transition-all duration-300"
            :style="{ width: lecture.video?.percent + '%' }"
          ></div>
        </div>
      </div>

      <!-- FAILED -->
      <div v-if="lecture.video?.status === 'failed'" class="mt-3 text-sm text-red-600">
        Video processing failed. Please try to re-upload the video.
      </div>
    </template>

    <!-- ================= EDIT MODE ================= -->
    <template v-else class="p-4">
      <div class="">
        <label class="block mb-4">
          <input
            type="file"
            ref="uploader"
            :multiple="false"
            accept="video/*"
            class="block !cursor-pointer w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
      </div>
      <BaseButton type="button" @click="cancel"> Upload </BaseButton>
    </template>
  </div>
</template>

<style scoped></style>
