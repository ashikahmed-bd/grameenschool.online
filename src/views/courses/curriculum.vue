<script setup>
import { onMounted, reactive, ref } from 'vue'
import draggable from 'vuedraggable'
import CourseLayout from '@/layouts/CourseLayout.vue'
import BaseLectureItem from '@/components/BaseLectureItem.vue'
import BaseCourseSection from '@/components/BaseCourseSection.vue'
import { useCourseStore } from '@/stores/course'
import { useRoute } from 'vue-router'

const courseStore = useCourseStore()
const route = useRoute()

const sections = ref(null)

const loadCurriculum = () => {
  courseStore.getCurriculum(route.params.id)
}

const handleSectionDrag = () => {
  console.log('Sections reordered:', sections)
}

const handleLectureDrag = (section) => {
  console.log(`Lectures reordered in section ${section.title}:`, section.lectures)
}

onMounted(() => {
  loadCurriculum()
})
</script>

<template>
  <CourseLayout>
    <div class="bg-white border p-4 rounded-2xl">
      <div class="border-b border-border py-2">
        <h2 class="text-xl font-semibold">Course Curriculum</h2>
      </div>

      <div class="space-y-4">
        <draggable
          group="sections"
          item-key="id"
          ghost-class="bg-gray-800"
          class="space-y-4"
          :list="sections"
          handle=".section-title"
          @change="handleSectionDrag"
        >
          <template #item="{ element: section, index }">
            <BaseCourseSection :section="section">
              <draggable
                group="lectures"
                itemKey="id"
                ghost-class="dragged-ghost"
                class="space-y-4"
                :list="section.lectures"
                handle=".drag-handle"
                @change="handleLectureDrag"
              >
                <template #item="{ element: lecture }">
                  <BaseLectureItem :lecture="lecture" />
                </template>
              </draggable>
            </BaseCourseSection>
          </template>
        </draggable>
      </div>
    </div>
  </CourseLayout>
</template>

<style scoped></style>
