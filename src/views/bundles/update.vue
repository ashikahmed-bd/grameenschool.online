<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseFile from '@/components/BaseFile.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import Default from '@/layouts/Default.vue'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useBundleStore } from '@/stores/collection'
import { useRoute } from 'vue-router'

const bundleStore = useBundleStore()
const { errors } = storeToRefs(bundleStore)

const route = useRoute()

// ================== STATE ==================
const bundle = ref({})

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
const loadBundle = async () => {
  const response = await bundleStore.show(route.params.id)
  bundle.value = response.data

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

  await bundleStore.update(route.params.id, formData)
}

const removeCourseFromBundle = async (course) => {
  if (confirm('Are you sure you went Course removed from bundle?')) {
    await bundleStore.removeCourse(route.params.id, course)
  }
}

// ==== MOUNT ===
onMounted(async () => {
  await loadBundle()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Update Bundle</h3>
        <RouterLink :to="{ name: 'bundles' }" class="card__link"> All Bundles </RouterLink>
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
                  v-if="bundle.banner_url"
                  :src="bundle.banner_url"
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
                  v-if="bundle.icon_url"
                  :src="bundle.icon_url"
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

            <BaseButton :loading="bundleStore.loading">Update</BaseButton>
          </form>

          <!-- load bundle Courses -->
          <div class="card__body space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <article v-for="course in bundle.courses" :key="course.id" class="relative">
                <img :src="course.cover_url" class="w-full h-auto rounded" />
                <button
                  type="button"
                  @click="removeCourseFromBundle(course.id)"
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
