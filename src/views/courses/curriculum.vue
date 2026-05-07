<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import Default from '@/layouts/Default.vue'
import BaseLectureItem from '@/components/BaseLectureItem.vue'
import BaseSectionForm from '@/components/BaseSectionForm.vue'
import BaseSectionItem from '@/components/BaseSectionItem.vue'

import { useCourseStore } from '@/stores/course'
import { useSectionStore } from '@/stores/section'

const route = useRoute()
const courseStore = useCourseStore()
const sectionStore = useSectionStore()

const { curriculum } = storeToRefs(courseStore)

const createSectionForm = ref(false)

const loadCurriculum = async () => {
  await courseStore.getCurriculum(route.params.id)
}

const handleSectionCreated = async () => {
  createSectionForm.value = false
  await loadCurriculum()
}

const sectionDeleted = async (section) => {
  if (confirm('Are you sure you want to delete this section?')) {
    await sectionStore.delete(route.params.id, section.id)
    await loadCurriculum()
  }
}

onMounted(() => {
  loadCurriculum()
})
</script>

<template>
  <Default>
    <nav class="flex items-center gap-6">
      <RouterLink
        :to="{ name: 'course.basic', params: { id: route.params.id } }"
        class="bg-white flex items-center gap-3 px-4 py-2 rounded hover:text-primary-800 transition"
        active-class="text-primary font-medium"
      >
        <span>Information</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'course.curriculum', params: { id: route.params.id } }"
        class="bg-white flex items-center gap-3 px-4 py-2 rounded hover:text-primary-800 transition"
        active-class="text-primary font-medium"
      >
        <span>Curriculum</span>
      </RouterLink>
    </nav>

    <div class="rounded-2xl bg-white p-4">
      <div class="space-y-4">
        <BaseSectionItem
          v-for="section in curriculum?.data"
          :key="section.id"
          :section="section"
          @deleted="sectionDeleted"
          @reloaded="loadCurriculum"
        >
          <div class="space-y-3">
            <BaseLectureItem
              v-for="lecture in section.lectures"
              :key="lecture.id"
              :lecture="lecture"
              @updated="loadCurriculum"
              @deleted="loadCurriculum"
            />
          </div>
        </BaseSectionItem>

        <div v-if="!createSectionForm">
          <button
            @click="createSectionForm = true"
            class="rounded bg-black px-4 py-2 text-xs text-white hover:bg-gray-800"
          >
            Create Section
          </button>
        </div>

        <BaseSectionForm
          v-else
          @created="handleSectionCreated"
          @cancel="createSectionForm = false"
        />
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
