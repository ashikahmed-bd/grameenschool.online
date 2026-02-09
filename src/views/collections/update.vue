<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseFile from '@/components/BaseFile.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import Default from '@/layouts/Default.vue'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useCollectionStore } from '@/stores/collection'
import { useRoute } from 'vue-router'

const collectionStore = useCollectionStore()
const { errors } = storeToRefs(collectionStore)

const route = useRoute()

// ================== STATE ==================
const collection = ref({})

// === Reactive form ===
const form = reactive({
  title: '',
  slug: '',
  description: '',
  icon: null,
  icon_url: '',
  banner: null,
  banner_url: '',
  status: 'draft',
})

// === LOAD EXISTING BUNDLE ===
const loadCollection = async () => {
  const response = await collectionStore.show(route.params.id)
  collection.value = response.data

  form.title = response.data.title
  form.slug = response.data.slug
  form.description = response.data.description
  form.status = response.data.status
}

// ================== SUBMIT ==================
const submit = async () => {
  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('title', form.title)
  formData.append('slug', form.slug)
  formData.append('description', form.description)

  if (form.icon) {
    formData.append('icon', form.icon)
  }

  if (form.banner) {
    formData.append('banner', form.banner)
  }
  formData.append('status', form.status)

  await collectionStore.update(route.params.id, formData)
}

const removeCourseFromCollection = async (course) => {
  if (confirm('Are you sure you went Course removed from collection?')) {
    await collectionStore.removeCourse(route.params.id, course)
  }
}

// ==== MOUNT ===
onMounted(async () => {
  await loadCollection()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Update Collection</h3>
        <RouterLink :to="{ name: 'collections' }" class="card__link"> All Collections </RouterLink>
      </div>

      <div class="card__body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- LEFT FORM -->
          <form @submit.prevent="submit" enctype="multipart/form-data" class="col-span-2 space-y-4">
            <BaseInput
              label="Title"
              v-model="form.title"
              placeholder="Enter title"
              :error="errors.title"
              required
            />
            <BaseInput
              label="Slug"
              v-model="form.slug"
              placeholder="Enter slug"
              :error="errors.slug"
              required
            />
            <BaseTextarea
              label="Description"
              v-model="form.description"
              placeholder="Enter overview"
              :error="errors.description"
              required
            />

            <div class="grid grid-cols-3 gap-4">
              <div class="flex gap-2">
                <BaseFile
                  label="Banner"
                  @change="(e) => (form.banner = e.target.files[0])"
                  :error="errors.banner"
                />
                <img
                  v-if="collection?.banner_url"
                  :src="collection?.banner_url"
                  alt="Cover"
                  class="size-16 rounded"
                />
              </div>

              <div class="flex gap-2">
                <BaseFile
                  label="Icon"
                  @change="(e) => (form.icon = e.target.files[0])"
                  :error="errors.icon"
                />
                <img
                  v-if="collection.icon_url"
                  :src="collection.icon_url"
                  alt="Cover"
                  class="size-16 rounded"
                />
              </div>

              <BaseSelect
                v-model="form.status"
                label="Status"
                :options="[
                  { label: 'Draft', value: 'draft' },
                  { label: 'Published', value: 'published' },
                ]"
                :error="errors.status"
                required
              />
            </div>

            <BaseButton :loading="collectionStore.loading">Update</BaseButton>
          </form>

          <!-- load Collection Courses -->
          <div class="card__body space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <article v-for="course in collection.courses" :key="course.id" class="relative">
                <img :src="course.cover_url" class="w-full h-auto rounded" />
                <button
                  type="button"
                  @click="removeCourseFromCollection(course.id)"
                  class="absolute -top-2 -right-2 text-white cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4 bg-danger p-0.5 rounded-full"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>
