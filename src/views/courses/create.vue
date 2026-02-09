<script setup>
import Default from '@/layouts/Default.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/categories.js'
import { useCourseStore } from '@/stores/course.js'
import IconClose from '@/components/icons/IconClose.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import QuillEditor from '@/components/QuillEditor.vue'
import { useInstructorStore } from '@/stores/instructor'
import { useCollectionStore } from '@/stores/collection'

const router = useRouter()
const categoryStore = useCategoryStore()
const courseStore = useCourseStore()
const instructorStore = useInstructorStore()
const collectionStore = useCollectionStore()

const { errors } = storeToRefs(courseStore)

const categories = ref([])
const selectedCategory = ref('')
const instructorsItems = ref([])
const collections = ref([])

// Reactive course form
const form = reactive({
  title: '',
  slug: '',
  overview: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  level: 'all',
  is_feature: false,
  duration: '',
  price: '',
  description: '',
  published_at: '',
  cover: '',
  video_id: '',
  provider: 'youtube',
  category_id: selectedCategory,
  subcategory_id: '',
  status: 'draft',
  instructors: [],
  learnings: [],
  requirements: [],
  features: [],
})

// Submit logic
const submit = async () => {
  await courseStore.store(form, router)
}

// Learnings, Requirements, Features
const newLearning = ref('')
const newRequirement = ref('')
const newFeature = ref('')

const addLearning = () => {
  if (newLearning.value.trim()) {
    form.learnings.push(newLearning.value.trim())
    newLearning.value = ''
  }
}
const removeLearning = (i) => {
  form.learnings.splice(i, 1)
}
const addRequirement = () => {
  if (newRequirement.value.trim()) {
    form.requirements.push(newRequirement.value.trim())
    newRequirement.value = ''
  }
}
const removeRequirement = (i) => {
  form.requirements.splice(i, 1)
}
const addFeature = () => {
  if (newFeature.value.trim()) {
    form.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}
const removeFeature = (i) => {
  form.features.splice(i, 1)
}

const loadInstructor = async () => {
  const response = await instructorStore.search('')
  instructorsItems.value = response.data
}

const loadCollections = async () => {
  const response = await collectionStore.search()
  collections.value = response.data
}

const loadCategories = async () => {
  const response = await categoryStore.search()
  categories.value = response.data
}

// Subcategories computed
const subcategories = computed(() => {
  if (!form.category_id || !categories.value) return []
  return categories.value.find((c) => c.id === form.category_id)?.children || []
})

onMounted(() => {
  loadCategories()
  loadInstructor()
  loadBundles()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Create New Course</h3>
        <RouterLink :to="{ name: 'courses' }" class="base__button">All Courses</RouterLink>
      </div>

      <div class="card__body">
        <form @submit.prevent="submit">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Left -->
            <div class="w-full md:col-span-2">
              <div class="grid grid-cols-1 gap-4">
                <div class="form__group">
                  <label class="form__label">Title</label>
                  <input
                    type="text"
                    v-model="form.title"
                    class="form__control"
                    placeholder="Learn English Spoken"
                  />
                </div>

                <div class="form__group">
                  <label class="form__label">Slug</label>
                  <input
                    type="text"
                    v-model="form.slug"
                    class="form__control"
                    placeholder="learn_english_spoken"
                  />
                </div>

                <div class="form__group">
                  <label class="form__label">Overview</label>
                  <textarea
                    class="form__control"
                    v-model="form.overview"
                    placeholder="A short overview of the course"
                  ></textarea>
                </div>

                <BaseInput
                  id="meta_title"
                  label="Meta Title"
                  v-model="form.meta_title"
                  name="meta_title"
                  placeholder="Enter meta title"
                  :error="errors.meta_title"
                  :required="true"
                />

                <BaseTextarea
                  label="Meta Description"
                  v-model="form.meta_description"
                  placeholder="Enter meta description"
                  :error="errors.meta_description"
                  :required="true"
                />

                <BaseTextarea
                  v-model="form.meta_keywords"
                  label="Meta Keywords"
                  placeholder="Write your note here..."
                  :error="errors.meta_keywords"
                />
              </div>

              <QuillEditor v-model="form.description" label="Description" />

              <!-- Learnings & Requirements -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form__group border border-border p-4 rounded-xl">
                  <label class="form__label">What will students learn?</label>
                  <div class="relative flex items-center">
                    <input
                      type="text"
                      v-model="newLearning"
                      @keydown.enter.prevent="addLearning"
                      placeholder="Add learning & press Enter"
                      class="form__control"
                    />
                    <button
                      type="button"
                      @click="addLearning"
                      class="absolute right-0 top-0 bg-primary text-white cursor-pointer px-2 h-full rounded-r"
                    >
                      <IconPlus class="size-5" />
                    </button>
                  </div>
                  <ul v-for="(item, index) in form.learnings" :key="index" class="mt-3">
                    <li class="flex items-center justify-between gap-2">
                      <span>{{ item }}</span>
                      <button
                        type="button"
                        @click="removeLearning(index)"
                        class="bg-primary text-white rounded cursor-pointer"
                      >
                        <IconClose class="size-4" />
                      </button>
                    </li>
                  </ul>
                </div>

                <div class="form__group space-y-4">
                  <div class="border border-border p-4 rounded-xl">
                    <label class="form__label">Requirements?</label>
                    <div class="relative flex items-center">
                      <input
                        type="text"
                        v-model="newRequirement"
                        @keydown.enter.prevent="addRequirement"
                        placeholder="Add requirement & press Enter"
                        class="form__control"
                      />
                      <button
                        type="button"
                        @click="addRequirement"
                        class="absolute right-0 top-0 bg-primary text-white cursor-pointer px-2 h-full rounded-r"
                      >
                        <IconPlus class="size-5" />
                      </button>
                    </div>
                    <ul v-for="(item, index) in form.requirements" :key="index" class="mt-3">
                      <li class="flex items-center justify-between gap-2">
                        <span>{{ item }}</span>
                        <button
                          type="button"
                          @click="removeRequirement(index)"
                          class="bg-primary text-white rounded cursor-pointer"
                        >
                          <IconClose class="size-4" />
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div class="border border-border p-4 rounded-xl">
                    <label class="form__label">Features ?</label>
                    <div class="relative flex items-center">
                      <input
                        type="text"
                        v-model="newFeature"
                        @keydown.enter.prevent="addFeature"
                        placeholder="Add feature & press Enter"
                        class="form__control"
                      />
                      <button
                        type="button"
                        @click="addFeature"
                        class="absolute right-0 top-0 bg-primary text-white cursor-pointer px-2 h-full rounded-r"
                      >
                        <IconPlus class="size-5" />
                      </button>
                    </div>
                    <ul v-for="(item, index) in form.features" :key="index" class="mt-3">
                      <li class="flex items-center justify-between gap-2">
                        <span>{{ item }}</span>
                        <button
                          type="button"
                          @click="removeFeature(index)"
                          class="bg-primary text-white rounded cursor-pointer"
                        >
                          <IconClose class="size-4" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right -->
            <div class="w-full">
              <!-- Parent -->
              <BaseSelect
                v-model="form.category_id"
                label="Parent"
                :options="
                  categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))
                "
                placeholder="Choose Parent"
                :error="errors.category_id"
                required
              />

              <!-- Children -->
              <BaseSelect
                v-model="form.subcategory_id"
                label="Children"
                :options="
                  subcategories.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))
                "
                placeholder="Choose children"
                :disabled="!form.category_id"
                :error="errors.subcategory_id"
                required
              />

              <!-- Bundles -->
              <BaseSelect
                v-model="form.bundle_id"
                label="Bundles"
                :options="
                  bundles.map((bundle) => ({
                    value: bundle.id,
                    label: bundle.title,
                  }))
                "
                placeholder="Choose Bundle"
                :error="errors.bundle_id"
                required
              />

              <BaseSelect
                v-model="form.level"
                for="level"
                label="Level"
                id="level"
                name="level"
                :options="[
                  { value: 'all', label: 'All' },
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                ]"
                :error="errors.level"
                :required="true"
              />

              <div class="form__group">
                <label class="form__label">Features</label>
                <select v-model="form.is_feature" class="form__select w-full">
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </div>

              <BaseInput
                type="number"
                label="Duration in minutes"
                v-model="form.duration"
                placeholder="e.g. 650 minutes"
                :error="errors.duration"
                :required="true"
              />

              <BaseInput
                type="number"
                label="Price"
                v-model="form.price"
                placeholder="e.g. 1000"
                :error="errors.price"
                :required="true"
              />

              <div class="form__group">
                <label class="form__label">Discount Type</label>
                <select v-model="form.discount_type" class="form__select w-full">
                  <option value="" disabled selected>Select Type</option>
                  <option value="fixed">Fixed</option>
                  <option value="percent">Percentage</option>
                </select>
              </div>

              <BaseInput
                type="number"
                v-model="form.discount_amount"
                label="Discount Amount"
                placeholder="e.g. 500"
                :error="errors.price"
                required
              />

              <div class="form__group">
                <label class="form__label">Discount Start</label>
                <input
                  type="date"
                  v-model="form.discount_starts_at"
                  class="form__control"
                  required
                />
              </div>

              <div class="form__group">
                <label class="form__label">Discount End</label>
                <input type="date" v-model="form.discount_ends_at" class="form__control" required />
              </div>

              <div class="form__group">
                <label class="form__label">Intro Video ID</label>
                <input
                  type="text"
                  v-model="form.video_id"
                  class="form__control"
                  placeholder="YouTube/Vimeo ID"
                />
              </div>
              <div class="form__group">
                <label class="form__label">Video Provider</label>
                <select v-model="form.provider" class="form__select w-full">
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                </select>
              </div>

              <div class="form__group">
                <label class="form__label">Status</label>
                <select v-model="form.status" class="form__select w-full">
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div class="form__group">
                <label>Instructors</label>
                <select v-model="form.instructors" multiple class="form__select w-full">
                  <option v-for="item in instructorsItems || []" :key="item.id" :value="item.id">
                    {{ item.user?.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="form__group">
            <BaseButton :loading="courseStore.loading">Submit</BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Default>
</template>
