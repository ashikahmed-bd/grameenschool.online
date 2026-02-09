<script setup>
import Default from "@/layouts/Default.vue";
import BaseTable from "@/components/BaseTable.vue";
import { useCategoryStore } from "@/stores/categories.js";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import DataTableSkeleton from "@/components/DataTableSkeleton.vue";

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const getCategories = async (page = 1) => {
  await categoryStore.all(page);
}

const deleteCategory = async (categoryId) => {
  if (confirm('Are you sure you went to deleted categories?')) {
    await categoryStore.delete(categoryId);
    await getCategories();
  }
}

onMounted(() => {
  getCategories();
});


</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Categories List</h3>
        <RouterLink :to="{ name: 'categories.create' }" class="base__button">Add New</RouterLink>
      </div>

      <div class="card__body">
        <template v-if="categories.data">
          <div class="relative overflow-y-auto">
            <table>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Parent</th>
                  <th>Homepage</th>
                  <th>Sort Order</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <template v-for="category in categories.data" :key="category.id">
                  <!-- Parent Row -->
                  <tr class="border-b hover:bg-gray-50 bg-white">
                    <td class="py-3 px-4">
                      <img :src="category.icon_url" :alt="category.name + ' icon'"
                        class="h-8 w-8 rounded object-cover" />
                    </td>
                    <td class="font-semibold">{{ category.name }}</td>
                    <td>—</td>
                    <td>
                      <span :class="category.show_on_homepage
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'"
                        class="inline-block rounded-full text-xs font-semibold px-2 py-1">
                        {{ category.show_on_homepage ? 'Show' : 'Hide' }}
                      </span>
                    </td>
                    <td>{{ category.sort_order }}</td>
                    <td>
                      <span :class="category.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'"
                        class="inline-block rounded-full text-xs font-semibold px-2 py-1">
                        {{ category.active ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 space-x-2">
                      <RouterLink :to="{ name: 'categories.edit', params: { id: category.id } }"
                        class="badge badge__success">
                        Edit</RouterLink>
                      <button class="badge badge__danger" @click.prevent="deleteCategory(category.id)">Delete</button>
                    </td>
                  </tr>

                  <!-- Children Rows -->
                  <tr v-for="child in category.children" :key="child.id" class="border-b hover:bg-gray-50 bg-gray-50">
                    <td class="py-3 px-4">
                      <img :src="child.icon_url" :alt="child.name + ' icon'" class="h-8 w-8 rounded object-cover" />
                    </td>
                    <td class="pl-6 text-sm text-gray-700">-- {{ child.name }}</td>
                    <td>Child</td>
                    <td>
                      <span :class="child.show_on_homepage
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'"
                        class="inline-block rounded-full text-xs font-semibold px-2 py-1">
                        {{ child.show_on_homepage ? 'Show' : 'Hide' }}
                      </span>
                    </td>
                    <td>{{ child.sort_order }}</td>
                    <td>
                      <span :class="child.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'"
                        class="inline-block rounded-full text-xs font-semibold px-2 py-1">
                        {{ child.active ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="py-3 px-4 space-x-2">
                      <RouterLink :to="{ name: 'categories.edit', params: { id: child.id } }"
                        class="badge badge__success">
                        Edit</RouterLink>
                      <button type="button" @click.prevent="deleteCategory(child.id)"
                        class="badge badge__danger">Delete</button>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <Pagination class="mt-4" :total-items="categories.meta.total" :current-page="categories.meta.current_page"
            :items-per-page="categories.meta.per_page" :pages-to-show="2" @page-change="getCategories" visible-always />
        </template>

        <template v-else>
          <DataTableSkeleton />
        </template>
      </div>
    </div>

  </Default>
</template>

<style scoped></style>