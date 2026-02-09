<script setup>
import { ref, reactive } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

import IconChevronRight from './icons/IconChevronRight.vue'
import IconDelete from './icons/IconDelete.vue'
import IconEdit from './icons/IconEdit.vue'
import IconMove from './icons/IconMove.vue'
import BaseArticleContent from './BaseArticleContent.vue'
import BaseVideoContent from './BaseVideoContent.vue'
import IconPlay from './icons/IconPlay.vue'
import IconDocument from './icons/IconDocument.vue'
import BaseContentType from './BaseContentType.vue'

const props = defineProps({
  lecture: {
    type: Object,
    required: true,
  },
})

const expanded = ref(false)
const isEditing = ref(false)

const form = reactive({
  title: props.lecture.title,
})

function submit() {
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

function deleteLecture() {
  console.log('delete lecture', props.lecture.id)
}
</script>

<template>
  <Disclosure v-model="expanded">
    <div class="border border-slate-200 bg-white rounded">
      <!-- ================= EDIT MODE ================= -->
      <div v-if="isEditing" class="p-4">
        <form @submit.prevent="submit">
          <input
            v-model="form.title"
            class="w-full border border-slate-200 px-3 py-2 rounded"
            placeholder="Lecture title"
          />
          <div class="mt-4 flex justify-end gap-2">
            <button type="button" @click="cancelEdit" class="border px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" class="bg-black text-white px-4 py-2 rounded">
              Save lecture
            </button>
          </div>
        </form>
      </div>

      <!-- ================= HEADER ================= -->
      <DisclosureButton
        v-else
        class="group w-full flex items-center justify-between px-4 py-2 text-left"
      >
        <div class="flex items-center gap-2 text-sm">
          <!-- lecture status -->
          <svg
            v-if="lecture.has_content"
            class="w-5 h-5 text-green-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>

          <span class="font-medium"> Lecture {{ lecture.sort_order }}: </span>
          <span class="text-slate-600">{{ lecture.type === 'video' ? '▶' : '📄' }}</span>
          <span>{{ lecture.title }}</span>
        </div>

        <div class="flex items-center gap-3">
          <!-- hover actions -->
          <div
            class="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <button @click.stop="deleteLecture" class="text-red-600">
              <IconDelete class="w-5 h-5" />
            </button>
            <button @click.stop="isEditing = true" class="text-blue-600">
              <IconEdit class="w-5 h-5" />
            </button>
            <button class="cursor-move">
              <IconMove class="w-5 h-5" />
            </button>
          </div>

          <button
            v-if="!lecture.has_content"
            @click="expanded = !expanded"
            class="border border-slate-400 px-2 py-1 text-xs rounded"
          >
            Add content
          </button>

          <IconChevronRight
            v-if="!isEditing"
            class="w-5 h-5 transition-transform duration-300"
            :class="expanded ? 'rotate-90' : ''"
          />
        </div>
      </DisclosureButton>

      <!-- ================= CONTENT ================= -->
      <DisclosurePanel class="border-t border-slate-200 p-4 space-y-3">
        <!-- SELECT CONTENT TYPE -->
        <template v-if="!lecture.has_content">
          <BaseContentType :expanded="expanded" :lecture="lecture" />
        </template>

        <!-- ARTICLE CONTENT -->
        <template v-else-if="lecture.type === 'text'">
          <BaseArticleContent :lecture="lecture" />
        </template>

        <!-- VIDEO CONTENT -->
        <template v-else-if="lecture.type === 'video'">
          <BaseVideoContent :lecture="lecture" />
        </template>
      </DisclosurePanel>
    </div>
  </Disclosure>
</template>
