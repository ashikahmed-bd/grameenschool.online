<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useCourseStore } from '@/stores/course.js'
import { useRoute } from 'vue-router'
import QuillEditor from '@/components/QuillEditor.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import { useInstructorStore } from '@/stores/instructor'
import BaseTabs from '@/components/BaseTabs.vue'
import Curriculum from '@/components/Curriculum.vue'
import { useBundleStore } from '@/stores/collection'

const route = useRoute()
const courseStore = useCourseStore()
const instructorStore = useInstructorStore()
const bundleStore = useBundleStore()

const errors = ref([])
const course = ref({})
const categories = ref([])
const levels = ref([])
const instructorsItems = ref([])
const bundles = ref([])

const form = reactive({
  title: '',
  slug: '',
  overview: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  description: '',
  duration: '',
  is_feature: false,
  price: '',
  discount_type: '',
  discount_amount: '',
  discount_starts_at: '',
  discount_ends_at: '',
  level: '',
  category_id: '',
  subcategory_id: '',
  bundle_id: '',
  published_at: '',
  video_id: '',
  provider: '',
  cover: '',
  cover_url: '',
  status: '',
  instructors: [], // array of string IDs
  learnings: [],
  requirements: [],
  features: [],
})

const newLearning = ref('')
const newRequirement = ref('')
const newFeature = ref('')
const cover = ref(null)

const loadBasicInfo = async () => {
  const response = await courseStore.getBasic(route.params.id)
  course.value = response.course
  categories.value = response.categories
  levels.value = response.levels

  form.title = response.course.title
  form.meta_title = response.course.meta_title
  form.meta_description = response.course.meta_description
  form.meta_keywords = response.course.meta_keywords
  form.slug = response.course.slug
  form.overview = response.course.overview
  form.description = response.course.description
  form.duration = response.course.duration
  form.is_feature = response.course.is_feature

  form.price = response.course.price
  form.discount_type = response.course.discount.type
  form.discount_amount = response.course.discount.amount
  form.discount_starts_at = response.course.discount.starts_at
  form.discount_ends_at = response.course.discount.ends_at

  form.level = response.course.level
  form.category_id = response.course.category_id || ''
  form.subcategory_id = response.course.subcategory_id || ''
  form.bundle_id = response.course.bundle_id || ''
  form.published_at = response.course.published_at || ''
  form.cover = ''
  form.cover_url = response.course.cover_url

  form.video_id = response.course.intro?.video_id || ''
  form.provider = response.course.intro?.provider || 'youtube'

  form.learnings = [...(response.course.learnings || [])]
  form.requirements = [...(response.course.requirements || [])]
  form.features = [...(response.course.features || [])]
  form.status = response.course.status

  // Pre-fill instructors as string IDs
  form.instructors = (response.course.instructors || []).map((instructor) => instructor.id)
}

const loadInstructor = async () => {
  const response = await instructorStore.search('')
  instructorsItems.value = response.data
}

const loadBundles = async () => {
  const response = await bundleStore.search()
  bundles.value = response.data
}

onMounted(() => {
  loadBasicInfo()
  loadInstructor()
  loadBundles()
})

const submit = async () => {
  await courseStore.update(route.params.id, form)
  await loadBasicInfo()
}

// Learnings, Requirements, Features
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

// Cover upload
const coverUpload = async () => {
  const file = cover.value.files[0]
  if (!file) return alert('Please select a file!')
  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('cover', file)
  await courseStore.coverUpload(route.params.id, formData)
  loadBasicInfo()
}

// Subcategories computed
const subcategories = computed(() => {
  if (!form.category_id || !categories.value) return []
  return categories.value.find((c) => c.id === form.category_id)?.children || []
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Header (sticky) -->
    <header class="bg-dark sticky top-0 z-40 text-white py-4 shadow">
      <div class="max-w-5xl mx-auto">
        <nav class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <RouterLink :to="{ name: 'courses' }" class="underline"> Back to Courses </RouterLink>
            <h3 class="text-base font-semibold">{{ course.title }}</h3>
          </div>
        </nav>
      </div>
    </header>

    <main class="max-w-5xl mx-auto">
      <nav class="py-4">
        <BaseTabs
          :tabs="[
            { label: 'Information', slot: 'tabInformation' },
            { label: 'Curriculum ', slot: 'tabCurriculum' },
          ]"
        >
          <template #tabInformation>
            <div class="card border border-border">
              <div class="card__header">
                <h3 class="card__title">Basic information</h3>
                <button class="base__button capitalize">{{ course.status }}</button>
              </div>

              <div class="card__body">
                <form @submit.prevent="submit">
                  <BaseInput
                    id="title"
                    label="Title"
                    v-model="form.title"
                    name="title"
                    placeholder="Enter title"
                    :error="errors.title"
                    :required="true"
                  />

                  <BaseInput
                    id="slug"
                    label="slug"
                    v-model="form.slug"
                    name="slug"
                    placeholder="Enter slug"
                    :error="errors.slug"
                    :required="true"
                  />

                  <div class="form__group">
                    <label class="form__label">Overview</label>
                    <textarea
                      v-model="form.overview"
                      class="form__control"
                      rows="4"
                      placeholder="Course overview"
                    ></textarea>
                  </div>

                  <BaseInput
                    label="Meta Title"
                    v-model="form.meta_title"
                    placeholder="Enter meta title"
                    :error="errors.meta_title"
                  />

                  <div class="form__group">
                    <label class="form__label">Meta Description</label>
                    <textarea
                      v-model="form.meta_description"
                      class="form__control"
                      placeholder="Course Meta Description"
                    ></textarea>
                  </div>

                  <div class="form__group">
                    <label class="form__label">Meta Keywords</label>
                    <textarea
                      v-model="form.meta_keywords"
                      class="form__control"
                      placeholder="Course Meta Keywords"
                    ></textarea>
                  </div>

                  <QuillEditor v-model="form.description" label="Description" />

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>

                  <div class="grid md:grid-cols-4 gap-4">
                    <div class="form__group">
                      <label class="form__label">Level</label>
                      <select v-model="form.level" class="form__select w-full">
                        <option :value="level.id" v-for="level in levels">{{ level.name }}</option>
                      </select>
                    </div>

                    <div class="form__group">
                      <label class="form__label">Features</label>
                      <select v-model="form.is_feature" class="form__select w-full">
                        <option :value="true">Yes</option>
                        <option :value="false">No</option>
                      </select>
                    </div>

                    <div class="form__group">
                      <label class="form__label">Duration in Minutes</label>
                      <input
                        v-model="form.duration"
                        class="form__control"
                        placeholder="e.g. 650 minutes"
                      />
                    </div>

                    <BaseInput
                      v-model="form.price"
                      label="Price"
                      placeholder="e.g. 500"
                      :error="errors.price"
                      required
                    />
                  </div>

                  <div class="grid md:grid-cols-4 gap-4">
                    <div class="form__group">
                      <label class="form__label">Discount Type</label>
                      <select v-model="form.discount_type" class="form__select w-full">
                        <option value="" disabled selected>Select Type</option>
                        <option value="fixed">Fixed</option>
                        <option value="percent">Percentage</option>
                      </select>
                    </div>

                    <BaseInput
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
                      <input
                        type="date"
                        v-model="form.discount_ends_at"
                        class="form__control"
                        required
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="w-full">
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
                          <option
                            v-for="item in instructorsItems || []"
                            :key="item.id"
                            :value="item.id"
                          >
                            {{ item.user?.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="">
                      <form
                        @submit.prevent="coverUpload"
                        enctype="multipart/form-data"
                        class="flex items-center gap-2 py-2"
                      >
                        <div class="form__group w-full">
                          <input type="file" id="cover" ref="cover" class="form__file" />
                        </div>
                        <BaseButton type="submit">Upload</BaseButton>
                      </form>
                      <div class="form__group">
                        <img :src="form.cover_url" alt="cover" class="w-full h-auto rounded" />
                      </div>
                    </div>
                  </div>

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

                  <div class="form__group">
                    <BaseButton :loading="courseStore.loading">Submit</BaseButton>
                  </div>
                </form>
              </div>
            </div>
          </template>

          <template #tabCurriculum>
            <Curriculum />
          </template>
        </BaseTabs>
      </nav>
    </main>
  </div>
</template>

<style scoped></style>
