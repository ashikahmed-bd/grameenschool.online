<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseFile from '@/components/BaseFile.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import Default from '@/layouts/Default.vue'
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { useBundleStore } from '@/stores/collection'
import { useCategoryStore } from '@/stores/categories.js'

const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)
const bundleStore = useBundleStore()
const { errors } = storeToRefs(bundleStore)

const form = reactive({
  title: '',
  slug: '',
  description: '',
  icon: null,
  banner: null,
  status: 'draft',
})

const submit = async () => {
  const formData = new FormData()
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

  await bundleStore.store(formData)
}
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Add Bundle</h3>
        <RouterLink :to="{ name: 'bundles' }" class="card__link">All Bundles</RouterLink>
      </div>

      <div class="card__body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <form @submit.prevent="submit" enctype="multipart/form-data" class="col-span-2">
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
              placeholder="Enter Overview"
              :error="errors.description"
              required
            />

            <div class="grid grid-cols-3 gap-4">
              <BaseFile
                label="Banner"
                @change="(e) => (form.banner = e.target.files[0])"
                :error="errors.banner"
              />

              <BaseFile
                label="Icon"
                @change="(e) => (form.icon = e.target.files[0])"
                :error="errors.icon"
              />

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

            <BaseButton :loading="bundleStore.loading">Submit</BaseButton>
          </form>
        </div>
      </div>
    </div>
  </Default>
</template>
