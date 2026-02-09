<script setup>
import { onMounted, reactive, ref } from 'vue'
import CourseLayout from '@/layouts/CourseLayout.vue'
import TargetSection from '@/components/TargetSection.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import BaseInput from '@/components/BaseInput.vue'

const courseStore = useCourseStore()
const route = useRoute()

const form = reactive({
  learnings: [],
  requirements: [],
  benefits: [],
})

const submit = () => {
  courseStore.updateTargets(route.params.id, form)
}

const loadTargets = async () => {
  const response = await courseStore.getTargets(route.params.id)

  form.learnings = response.learnings
  form.requirements = response.requirements
  form.benefits = response.benefits
}

const benefits = ref([
  'আজীবন কোর্স অ্যাক্সেস',
  'স্টেপ-বাই-স্টেপ ভিডিও লেসন',
  'প্র্যাকটিস ফাইল ও রিসোর্স',
  'প্রফেশনাল প্রেজেন্টেশন টেমপ্লেট',
  'কোর্স শেষে সার্টিফিকেট',
])

onMounted(() => {
  loadTargets()
})
</script>

<template>
  <CourseLayout>
    <div class="bg-white rounded-2xl">
      <div class="border-b border-border px-4 py-2">
        <h2 class="text-xl font-semibold">Course Targets</h2>
      </div>

      <div class="divide-y divide-dashed divide-gray-300">
        <!-- LEARNINGS -->
        <div class="space-y-2 p-4">
          <h3 class="text-base font-semibold">Le</h3>
          <div class="group">
            <BaseInput placeholder="Enter text" />
          </div>
        </div>

        <!-- REQUIREMENTS -->

        <!-- BENEFITS -->
        <TargetSection
          title="Benefits"
          item-key-name="benefits"
          :items="form.benefits"
          @update="updateDraggable"
        />
      </div>

      <div class="p-4 text-right">
        <BaseButton>Save</BaseButton>
      </div>
    </div>
  </CourseLayout>
</template>

<style scoped></style>
