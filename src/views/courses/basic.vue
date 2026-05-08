<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseFile from '@/components/BaseFile.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import ListCard from '@/components/ListCard.vue'
import QuillEditor from '@/components/QuillEditor.vue'
import Default from '@/layouts/Default.vue'
import { useCollectionStore } from '@/stores/collection'
import { useCourseStore } from '@/stores/course'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const courseStore = useCourseStore();
const collectionStore = useCollectionStore();
const { errors } = storeToRefs(courseStore)
const route = useRoute()

const course = ref(null)
const levels = ref([])
const categories = ref([])

const newLearning = ref('')
const newRequirement = ref('')
const newInclude = ref('')

const coverFile = ref(null)
const previewUrl = ref('')

const form = reactive({
  title: '',
  slug: '',
  overview: '',
  description: '',

  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  canonical_url: '',

  category_id: '',
  subcategory_id: '',
  collection_id: '',
  level: 'all',
  is_feature: false,
  base_price: '',
  price: '',
  access_days: '',

  intro_id: '',
  status: '',
  learnings: [],
  requirements: [],
  includes: [],
})

const toArray = (value) => {
  if (Array.isArray(value)) return value
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const subcategories = computed(() => {
  if (!form.category_id) return []
  return categories.value.find((category) => category.id === form.category_id)?.children
})

const loadBasic = async () => {
  const response = await courseStore.getBasic(route.params.id)
  const data = response.course

  course.value = data
  categories.value = response.categories
  levels.value = response.levels

  form.title = data.title
  form.slug = data.slug
  form.overview = data.overview
  form.description = data.description

  form.meta_title = data.meta_title
  form.meta_description = data.meta_description
  form.meta_keywords = data.meta_keywords
  form.canonical_url = data.canonical_url

  form.category_id = data?.category?.id
  form.subcategory_id = data?.subcategory?.id
  form.collection_id = data?.collection?.id
  form.level = data.level
  form.base_price = data.base_price
  form.price = data.price
  form.access_days = data.access_days

  form.status = data.status

  form.learnings = toArray(data.learnings)
  form.requirements = toArray(data.requirements)
  form.includes = toArray(data.includes)
}

const submit = async () => {
  await courseStore.updateBasic(route.params.id, {
    ...form,
    learnings: [...form.learnings],
    requirements: [...form.requirements],
    includes: [...form.includes],
  })
}

const addLearning = () => {
  const value = newLearning.value.trim()
  if (!value) return

  form.learnings.push(value)
  newLearning.value = ''
}

const removeLearning = (index) => {
  form.learnings.splice(index, 1)
}

const addRequirement = () => {
  const value = newRequirement.value.trim()
  if (!value) return

  form.requirements.push(value)
  newRequirement.value = ''
}

const removeRequirement = (index) => {
  form.requirements.splice(index, 1)
}

const addInclude = () => {
  const value = newInclude.value.trim()
  if (!value) return

  form.includes.push(value)
  newInclude.value = ''
}

const removeInclude = (index) => {
  form.includes.splice(index, 1)
}

const handleCoverChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  coverFile.value = file

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  previewUrl.value = URL.createObjectURL(file)
}

const uploadCover = async () => {
  if (!coverFile.value) {
    alert('Please select a cover image')
    return
  }

  const formData = new FormData()
  formData.append('cover', coverFile.value)

  await courseStore.uploadCover(route.params.id, formData)
  await loadBasic()

  coverFile.value = null
}

const loadCollection = async () => {
  await collectionStore.all();
}

onMounted(() => {
  loadBasic();
  loadCollection();
})
</script>

<template>
  <Default>
    <div class="space-y-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Course Information</h1>
          <p class="text-sm text-gray-500">
            Update basic details, SEO, pricing and course includes.
          </p>
        </div>

        <nav class="flex rounded-full bg-white p-1">
          <RouterLink :to="{ name: 'course.basic', params: { id: route.params.id } }"
            class="rounded-full px-5 py-2 text-sm font-semibold text-gray-500 transition hover:text-primary"
            active-class="bg-primary text-white hover:text-white">
            Information
          </RouterLink>

          <RouterLink :to="{ name: 'course.curriculum', params: { id: route.params.id } }"
            class="rounded-full px-5 py-2 text-sm font-semibold text-gray-500 transition hover:text-primary"
            active-class="bg-primary text-white hover:text-white">
            Curriculum
          </RouterLink>
        </nav>
      </div>

      <form @submit.prevent="submit" class="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div class="space-y-6">
          <section class="rounded-3xl bg-white p-6">
            <h2 class="mb-5 text-lg font-bold text-gray-900">Basic Information</h2>

            <div class="grid gap-5">
              <BaseInput label="Title" v-model="form.title" placeholder="Enter title" :required="true"
                :error="errors.title" />

              <BaseInput label="Slug" v-model="form.slug" placeholder="Enter slug" :required="true"
                :error="errors.slug" />

              <BaseTextarea label="Overview" v-model="form.overview" placeholder="Enter overview" :required="true"
                :error="errors.overview" />

              <QuillEditor label="Description" v-model="form.description" placeholder="Enter description"
                :required="true" :error="errors.description" />
            </div>
          </section>

          <section class="rounded-3xl bg-white p-6">
            <h2 class="mb-5 text-lg font-bold text-gray-900">SEO Settings</h2>

            <div class="grid gap-5">
              <BaseInput label="Meta Title" v-model="form.meta_title" placeholder="Enter meta title"
                :error="errors.meta_title" />

              <BaseTextarea label="Meta Description" v-model="form.meta_description"
                placeholder="Enter meta description" :error="errors.meta_description" />

              <BaseTextarea label="Meta Keywords" v-model="form.meta_keywords" placeholder="Enter meta keywords"
                :error="errors.meta_keywords" />

              <BaseInput label="Canonical URL" v-model="form.canonical_url" placeholder="Enter canonical url"
                :error="errors.canonical_url" />
            </div>
          </section>

          <section class="rounded-3xl bg-white p-6">
            <h2 class="mb-5 text-lg font-bold text-gray-900">Category & Pricing</h2>

            <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <BaseSelect label="Category" v-model="form.category_id" placeholder="Select category"
                :options="categories" :required="true" :error="errors.category_id" />

              <BaseSelect label="Subcategory" v-model="form.subcategory_id" placeholder="Select subcategory"
                :options="subcategories" :error="errors.subcategory_id" />

              <BaseSelect label="Collection" v-model="form.collection_id" placeholder="Select collection" :options="collectionStore.collections?.data.map(collection => ({
                name: collection.title,
                id: collection.id
              }))" :error="errors.collection_id" />

              <BaseSelect label="Course Level" v-model="form.level" placeholder="Course level" :options="levels"
                :required="true" :error="errors.level" />

              <BaseInput label="Base Price" v-model="form.base_price" placeholder="Enter base price" :required="true"
                :error="errors.base_price" />

              <BaseInput label="Price" v-model="form.price" placeholder="Enter price" :required="true"
                :error="errors.price" />

              <BaseInput label="Access Days" v-model="form.access_days" placeholder="Enter access days" :required="true"
                :error="errors.access_days" />
              <BaseInput label="Intro Video URL" v-model="form.intro_id" placeholder="Enter intro video URL"
                :required="true" :error="errors.intro_id" />

              <BaseSelect label="Status" v-model="form.status" :options="[
                { name: 'Draft', id: 'draft' },
                { name: 'Pending', id: 'pending' },
                { name: 'Published', id: 'published' },
                { name: 'Archived', id: 'archived' }
              ]" placeholder="Select status" :required="true" :error="errors.status" />
            </div>
          </section>

          <section class="rounded-3xl bg-white p-6">
            <h2 class="mb-5 text-lg font-bold text-gray-900">Course Cover</h2>

            <div class="grid gap-3 lg:grid-cols-2">
              <div class="overflow-hidden rounded bg-gray-100">
                <img v-if="previewUrl || course?.cover_url" :src="previewUrl || course?.cover_url"
                  :alt="course?.title || 'Course cover'" class="aspect-video w-full object-cover" />

                <div v-else class="flex aspect-video items-center justify-center text-sm text-gray-400">
                  No cover image
                </div>
              </div>

              <div class="flex flex-col justify-between rounded-3xl border border-dashed border-gray-200 p-5">
                <div>
                  <BaseFile label="Upload JPEG, PNG, JPG or WEBP image."
                    accept="image/jpeg,image/png,image/jpg,image/webp" @change="handleCoverChange" />

                  <p class="mt-3 text-sm text-gray-500">Recommended size: 1280×720px.</p>
                </div>

                <BaseButton type="button" class="mt-5 w-full" :loading="courseStore.loading" @click="uploadCover">
                  Save Cover
                </BaseButton>
              </div>
            </div>
          </section>
        </div>

        <aside class="space-y-6 xl:sticky xl:top-6 xl:h-max">
          <ListCard title="What will students learn?" v-model="newLearning" :items="form.learnings"
            placeholder="Add learning & press Enter" @add="addLearning" @remove="removeLearning" />

          <ListCard title="Requirements" v-model="newRequirement" :items="form.requirements"
            placeholder="Add requirement & press Enter" @add="addRequirement" @remove="removeRequirement" />

          <ListCard title="Includes" v-model="newInclude" :items="form.includes" placeholder="Add include & press Enter"
            @add="addInclude" @remove="removeInclude" />

          <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <BaseButton :loading="courseStore.loading" type="submit" class="w-full">
              Save Changes
            </BaseButton>
          </div>
        </aside>
      </form>
    </div>

  </Default>
</template>

<style scoped></style>
