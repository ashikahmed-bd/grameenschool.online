<script setup>
import { reactive, onMounted } from "vue";
import Default from "@/layouts/Default.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useCategoryStore } from "@/stores/categories.js";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import BaseInput from "@/components/BaseInput.vue";
import BaseTextarea from "@/components/BaseTextarea.vue";

const categoryStore = useCategoryStore();
const { errors, categories } = storeToRefs(categoryStore);
const route = useRoute();

const form = reactive({
  name: '',
  slug: '',
  parent_id: '',
  sort_order: '',
  show_on_homepage: '',
  overview: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  icon: null,
  icon_url: null,
});

const submit = async () => {
  const formData = new FormData();
  formData.append('_method', 'PUT');
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
  await categoryStore.update(route.params.id, formData)
};

const loadCategory = async () => {
  const response = await categoryStore.show(route.params.id);
  form.name = response.data.name;
  form.slug = response.data.slug;
  form.sort_order = response.data.sort_order;
  form.parent_id = response.data.parent?.id,
    form.show_on_homepage = response.data.show_on_homepage,
    form.overview = response.data.overview,
    form.meta_title = response.data.meta_title,
    form.meta_description = response.data.meta_description,
    form.meta_keywords = response.data.meta_keywords,
    form.icon_url = response.data.icon_url
}

const getCategories = async (page = 1) => {
  await categoryStore.all(page);
}



onMounted(() => {
  loadCategory();
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

                <BaseInput v-model="form.name" label="Name" id="name" name="Name" type="text" placeholder="Enter Title"
                  :error="errors.name" required />

                <BaseInput v-model="form.slug" label="Slug" id="slug" name="slug" type="text" placeholder="Enter Slug"
                  :error="errors.slug" required />

                <BaseInput v-model="form.sort_order" label="Sort Order" id="sort_order" name="sort_order" type="text"
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
                  <small v-if="errors.parent_id" class="text-danger">{{ errors.parent_id[0] }}</small>
                </div>

                <div class="form__group col-span-2">
                  <label class="form__label">Overview</label>
                  <textarea v-model="form.overview" class="form__control"
                    placeholder="Enter meta Description"></textarea>
                  <small v-if="errors.overview" class="text-danger">{{ errors.overview[0] }}</small>
                </div>

                <BaseInput class="col-span-2" v-model="form.meta_title" label="Meta Title" id="meta_title"
                  name="Meta Title" type="text" placeholder="Enter Meta Title" :error="errors.meta_title" required />


                <BaseTextarea class="col-span-2" v-model="form.meta_description" label="Meta Description"
                  name="meta_description" placeholder="Write your description..." :error="errors.meta_description"
                  required />

                <BaseTextarea class="col-span-2" v-model="form.meta_keywords" label="Meta Keywords" name="meta_keywords"
                  placeholder="Write your Keywords..." :error="errors.meta_keywords" required />

              </div>
            </div>

            <div class="flex-none w-80">
              <div class="form__group">
                <label class="form__label">Icons</label>
                <input type="file" @change="e => form.icon = e.target.files[0]" class="form__file" />
                <small v-if="errors.icon" class="text-danger">{{ errors.icon[0] }}</small>
              </div>

              <div class="py-2">
                <img :src="form.icon_url" alt="icon" class="h-20 w-20 rounded border border-border p-2" />
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