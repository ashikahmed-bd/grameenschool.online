<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import ListCard from '@/components/ListCard.vue'
import QuillEditor from '@/components/QuillEditor.vue'
import Default from '@/layouts/Default.vue'
import { useCategoryStore } from '@/stores/categories'
import { useCourseStore } from '@/stores/course'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'

const categoryStore = useCategoryStore();
const courseStore = useCourseStore();
const { errors } = storeToRefs(courseStore)

const categories = ref([])

const newLearning = ref('')
const newRequirement = ref('')
const newInclude = ref('')

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
  level: 'all',
  is_feature: false,
  base_price: '',
  price: '',
  access_days: '',

  status: 'draft',
  learnings: [
    'স্কুল ও বোর্ড পরীক্ষার প্রস্তুতি নিতে পারবে',
    'বিষয়ভিত্তিক গুরুত্বপূর্ণ টপিক সহজভাবে বুঝতে পারবে',
    'প্র্যাকটিসের মাধ্যমে দক্ষতা বৃদ্ধি পাবে',
    'সমস্যা সমাধানের কৌশল শিখতে পারবে',
    'পরীক্ষায় ভালো ফলাফলের জন্য আত্মবিশ্বাস তৈরি হবে',
    'বাস্তব উদাহরণের মাধ্যমে শেখার সুযোগ পাবে',
    'নিয়মিত কুইজ ও অ্যাসাইনমেন্টের মাধ্যমে নিজেকে যাচাই করতে পারবে',
  ],

  requirements: [
    'নিয়মিত অনুশীলনের মানসিকতা',
    'ইন্টারনেট সংযোগ',
    'খাতা ও কলম',
    'মোবাইল বা কম্পিউটার ডিভাইস',
    'শেখার আগ্রহ',
  ],

  includes: [
    'সম্পূর্ণ ভিডিও ক্লাস',
    'PDF নোট ও স্টাডি ম্যাটেরিয়াল',
    'Practice Exercise',
    'মডেল টেস্ট',
    'অ্যাসাইনমেন্ট সাপোর্ট',
    'পরীক্ষার প্রস্তুতি গাইড',
    'লাইফটাইম এক্সেস',
    'কুইজ ও মূল্যায়ন',
    'রেকর্ডেড ক্লাস সুবিধা',
  ],
})

const loadCategories = async () => {
  const response = await categoryStore.search()
  categories.value = response.data
}

const subcategories = computed(() => {
  if (!form.category_id) return []
  return categories.value.find((category) => category.id === form.category_id)?.children
})


const submit = async () => {
  await courseStore.store({
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

onMounted(() => {
  loadCategories();
})
</script>

<template>
  <Default>
    <div class="space-y-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p class="text-sm text-gray-500">
            Add course details, pricing, SEO settings, and what’s included in this course.
          </p>
        </div>
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
              <BaseSelect label="Category" v-model="form.category_id" placeholder="Select category" :options="categories.map(category => ({
                name: category.name,
                id: category.id
              }))" :required="true" :error="errors.category_id" />

              <BaseSelect label="Subcategory" v-model="form.subcategory_id" placeholder="Select subcategory" :options="subcategories.map(children => ({
                name: children.name,
                id: children.id
              }))" :error="errors.subcategory_id" />

              <BaseSelect label="Course Level" v-model="form.level" placeholder="Course level" :options="[
                { name: 'All', id: 'all', },
                { name: 'Beginner', id: 'beginner', },
                { name: 'Intermediate', id: 'intermediate', },
                { name: 'Advanced', id: 'advanced', },
              ]" :required="true" :error="errors.level" />

              <BaseInput label="Base Price" v-model="form.base_price" placeholder="Enter base price" :required="true"
                :error="errors.base_price" />

              <BaseInput label="Price" v-model="form.price" placeholder="Enter price" :required="true"
                :error="errors.price" />

              <BaseInput label="Access Days" v-model="form.access_days" placeholder="Enter access days" :required="true"
                :error="errors.access_days" />
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
