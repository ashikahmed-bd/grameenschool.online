<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseFile from '@/components/BaseFile.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import QuillEditor from '@/components/QuillEditor.vue'
import CourseLayout from '@/layouts/CourseLayout.vue'
import { useCollectionStore } from '@/stores/collection'
import { useCourseStore } from '@/stores/course'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const collectionStore = useCollectionStore()
const courseStore = useCourseStore()
const route = useRoute()
const course = ref(null)
const levels = ref([])
const categories = ref([])
const collections = ref([])

const form = reactive({
  title: '',
  overview: '',
  description: '',

  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  canonical_url: '',

  category_id: '',
  subcategory_id: '',
  collection_id: '',
  level: '',
  duration: '',
  access_days: '',
  is_feature: false,
  base_price: '',
  price: '',
  provider: 'youtube',
  video_id: 'YE7VzlLtp-4',
})

const submit = () => {
  courseStore.updateBasic(route.params.id, form)
}

const loadBasic = async () => {
  const response = await courseStore.getBasic(route.params.id)
  course.value = response.course
  categories.value = response.categories
  levels.value = response.levels

  form.title = response.course.title
  form.overview = response.course.overview
  form.description = response.course.description
  form.meta_title = response.course.meta_title
  form.meta_description = response.course.meta_description
  form.meta_keywords = response.course.meta_keywords
  form.canonical_url = response.course.canonical_url

  form.category_id = response.course?.category?.id
  form.subcategory_id = response.course?.subcategory?.id
  form.collection_id = response.course?.collection?.id
  form.level = response.course.level
  form.duration = response.course.duration
  form.access_days = response.course.access_days
  form.is_feature = response.course.is_feature
  form.base_price = response.course.base_price
  form.price = response.course.price
  form.provider = response.course.intro?.provider
  form.video_id = response.course.intro?.video_id
}

const subcategories = computed(() => {
  if (!form.category_id) return []
  return categories.value.find((c) => c.id === form.category_id)?.children
})

const loadCollections = async () => {
  const response = await collectionStore.all()
  collections.value = response.data
}

onMounted(() => {
  loadBasic()
  loadCollections()
})
</script>

<template>
  <CourseLayout>
    <div class="bg-white p-4 rounded-2xl">
      <div class="flex items-center justify-between border-b border-border py-2">
        <h2 class="text-xl font-semibold">Basic Information</h2>
        <BaseButton :loading="courseStore.loading" @click="submit">Save</BaseButton>
      </div>

      <div class="divide-y divide-border">
        <div class="py-4">
          <BaseInput label="Title" v-model="form.title" placeholder="Enter title" />
          <BaseInput label="Meta Title" v-model="form.meta_title" placeholder="Enter meta title" />
          <BaseTextarea
            label="Meta Description"
            v-model="form.meta_description"
            placeholder="Enter meta description"
          />
          <BaseTextarea
            label="Meta Keywords"
            v-model="form.meta_keywords"
            placeholder="Enter meta keywords"
          />
          <BaseInput
            label="Canonical url"
            v-model="form.canonical_url"
            placeholder="Enter canonical url"
          />
          <BaseTextarea label="Overview" v-model="form.overview" placeholder="Enter title" />
          <QuillEditor label="Description" v-model="form.description" placeholder="Enter title" />
          <div class="grid grid-cols-3 gap-4">
            <BaseSelect label="Category" v-model="form.category_id" :items="categories" />
            <BaseSelect label="Subcategory" v-model="form.subcategory_id" :items="subcategories" />
            <BaseSelect
              label="Collection"
              v-model="form.collection_id"
              :items="
                collections.map((collection) => ({
                  id: collection.id,
                  name: collection.title,
                }))
              "
            />
          </div>

          <div class="grid grid-cols-4 gap-4">
            <BaseSelect label="Course Level" v-model="form.level" :items="levels" />
            <BaseInput
              label="Duration in minutes"
              v-model="form.duration"
              placeholder="e.g. 450 minutes"
            />

            <BaseInput
              label="Access Days"
              type="number"
              v-model="form.access_days"
              placeholder="e.g. 30, 90, 365"
            />

            <BaseSelect
              label="Is Feature"
              v-model="form.is_feature"
              :items="[
                { id: true, name: 'Yes' },
                { id: false, name: 'No' },
              ]"
            />
            <BaseInput
              label="Base Price"
              v-model="form.base_price"
              placeholder="Enter base price"
            />
            <BaseInput label="Price" v-model="form.price" placeholder="Enter price" />

            <BaseSelect
              label="Video Provider"
              v-model="form.provider"
              :items="[
                { id: 'youtube', name: 'Youtube' },
                { id: 'vimeo', name: 'Vimeo' },
              ]"
            />
            <BaseInput label="Video ID" v-model="form.video_id" placeholder="e.g. YE7VzlLtp-4" />
          </div>
        </div>

        <form class="py-4">
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2 rounded-lg overflow-hidden">
              <img src="/course.webp" alt="course" class="" />
            </div>
            <div class="space-y-4">
              <BaseFile label="Your image must be a JPEG or PNG format." />
              <BaseButton>Save</BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  </CourseLayout>
</template>

<style scoped></style>
