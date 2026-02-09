<script setup>
import Default from '@/layouts/Default.vue'
import { useBundleStore } from '@/stores/collection'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const bundleStore = useBundleStore()
const { bundles } = storeToRefs(bundleStore)

const loadBundles = async () => {
  await bundleStore.all()
}

const deleteBundle = async (bundle) => {
  if (confirm('Are you sure you went to deleted bundle?')) {
    await bundleStore.delete(bundle)
    await loadBundles()
  }
}

onMounted(() => {
  loadBundles()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Bundles List</h3>
        <RouterLink :to="{ name: 'bundle.create' }" class="card__link"> Add bundle </RouterLink>
      </div>
      <div class="card__body">
        <template v-if="bundles.data">
          <div class="relative overflow-y-auto">
            <table>
              <thead>
                <tr>
                  <th>Serial</th>
                  <th>Icon</th>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(bundle, index) in bundles.data" :key="bundle.id">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <img
                      :src="bundle.icon_url"
                      :alt="bundle.title"
                      class="h-8 w-8 rounded object-cover"
                    />
                  </td>
                  <td>
                    <img
                      :src="bundle.banner_url"
                      :alt="bundle.title"
                      class="h-8 w-8 rounded object-cover"
                    />
                  </td>
                  <td>{{ bundle.title }}</td>
                  <td class="truncate max-w-xs">
                    <span class="block truncate">{{ bundle.description }}</span>
                  </td>
                  <td>
                    <span v-if="bundle.status === 'draft'" class="badge badge__info">Draft</span>
                    <span v-else class="badge badge__success">Published</span>
                  </td>
                  <td>
                    <div class="space-x-2">
                      <RouterLink
                        :to="{ name: 'bundle.edit', params: { id: bundle.id } }"
                        class="badge badge__success"
                      >
                        View</RouterLink
                      >
                      <button @click="deleteBundle(bundle.id)" class="badge badge__danger">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <template v-else>
          <DataTableSkeleton />
        </template>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
