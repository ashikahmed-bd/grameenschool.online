<script setup>
import { reactive, onMounted } from "vue";
import Default from "@/layouts/Default.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useCategoryStore } from "@/stores/categories.js";
import { storeToRefs } from "pinia";
import BaseInput from "@/components/BaseInput.vue";

const categoryStore = useCategoryStore();
const { errors, categories } = storeToRefs(categoryStore);


const form = reactive({
  name: '',
  slug: '',
  sort_order: '',
  parent_id: '',
  show_on_homepage: '',
  overview: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  icon: null,
});

const submit = async () => {
  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('slug', form.slug);
  formData.append('sort_order', form.sort_order);
  formData.append('parent_id', form.parent_id || '');
  formData.append('show_on_homepage', form.show_on_homepage);
  formData.append('overview', form.overview);
  formData.append('meta_title', form.meta_title);
  formData.append('meta_description', form.meta_description);
  formData.append('meta_keywords', form.meta_keywords);

  if (form.icon) {
    formData.append('icon', form.icon);
  }

  await categoryStore.store(formData)
};

const getCategories = async () => {
  await categoryStore.all();
}


onMounted(() => {
  getCategories();
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Create New</h3>
        <RouterLink :to="{ name: 'categories' }" class="base__button">All Categories</RouterLink>
      </div>

      <div class="card__body">
        <form @submit.prevent="submit" enctype="multipart/form-data">
          <div class="flex items-start gap-6">
            <div class="flex-grow">
              <div class="grid grid-cols-2 gap-4">
                <BaseInput id="name" label="Name" v-model="form.name" name="name" placeholder="Enter name"
                  :error="errors.name" :required="true" />

                <BaseInput id="slug" label="Slug" v-model="form.slug" name="slug" placeholder="Enter slug"
                  :error="errors.slug" :required="true" />

                <BaseInput id="sort_order" label="Sort Order" type="number" v-model="form.sort_order" name="sort_order"
                  placeholder="Enter sort order" :error="errors.sort_order" />

                <div class="form__group">
                  <label class="form__label">Parent Category</label>
                  <select v-model="form.parent_id"
                    class="form__select w-full border border-gray-300 rounded px-4 py-2 text-sm">
                    <option value="" disabled>-- Select Category --</option>
                    <template v-for="parent in categories.data" :key="parent.id">
                      <!-- Parent Option -->
                      <option :value="parent.id">{{ parent.name }}</option>

                      <!-- Children Options -->
                      <option v-for="child in parent.children" :key="child.id" :value="child.id">
                        -- {{ child.name }}
                      </option>
                    </template>
                  </select>
                </div>
                <div class="form__group col-span-2">
                  <label class="form__label">Overview</label>
                  <textarea v-model="form.overview" class="form__control"
                    placeholder="Enter meta Description"></textarea>
                </div>
                <div class="form__group col-span-2">
                  <label class="form__label">Meta Title</label>
                  <input type="text" v-model="form.meta_title" class="form__control" placeholder="Enter meta title" />
                </div>
                <div class="form__group col-span-2">
                  <label class="form__label">Meta Description</label>
                  <textarea v-model="form.meta_description" class="form__control"
                    placeholder="Enter meta Description"></textarea>
                </div>
                <div class="form__group col-span-2">
                  <label class="form__label">Meta Keywords</label>
                  <input type="text" v-model="form.meta_keywords" class="form__control"
                    placeholder="Enter meta Keywords" />
                </div>
              </div>
            </div>
            <div class="flex-none w-80">
              <div class="form__group">
                <label class="form__label">Icons</label>
                <input type="file" @change="e => form.icon = e.target.files[0]" class="form__file" />
              </div>
              <div class="flex items-center justify-between mb-4">
                <label for="show_on_homepage" class="text-sm font-medium text-gray-700">Show On Homepage</label>
                <input id="show_on_homepage" type="checkbox" v-model="form.show_on_homepage"
                  class="h-4 w-4 border-gray-300 rounded focus:ring-0 accent-primary" />
              </div>
            </div>
          </div>

          <div class="form__group">
            <BaseButton :loading="categoryStore.loading">Submit</BaseButton>
          </div>

        </form>
      </div>
    </div>

  </Default>
</template>

<style scoped></style>