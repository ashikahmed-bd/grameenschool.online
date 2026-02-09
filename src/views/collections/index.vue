<script setup>
import Default from '@/layouts/Default.vue'
import { useCollectionStore } from '@/stores/collection'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const collectionStore = useCollectionStore()
const { collections } = storeToRefs(collectionStore)

const loadCollections = async () => {
  await collectionStore.all()
}

const deleteCollection = async (collection) => {
  if (confirm('Are you sure you went to deleted bundle?')) {
    await collectionStore.delete(collection)
    await loadCollections()
  }
}

onMounted(() => {
  loadCollections()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Collections List</h3>
        <RouterLink :to="{ name: 'collection.create' }" class="card__link">
          Add Collection
        </RouterLink>
      </div>
      <div class="card__body">
        <template v-if="collections.data">
          <div class="relative overflow-y-auto">
            <table>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="collection in collections.data" :key="collection.id">
                  <td>
                    <img
                      :src="collection.icon_url"
                      :alt="collection.title"
                      class="h-8 w-8 rounded object-cover"
                    />
                  </td>
                  <td>
                    <img
                      :src="collection.banner_url"
                      :alt="collection.title"
                      class="h-8 w-8 rounded object-cover"
                    />
                  </td>
                  <td>{{ collection.title }}</td>
                  <td class="truncate max-w-xs">
                    <span class="block truncate">{{ collection.description }}</span>
                  </td>
                  <td>
                    <span v-if="collection.status === 'draft'" class="badge badge__info"
                      >Draft</span
                    >
                    <span v-else class="badge badge__success">Published</span>
                  </td>
                  <td>
                    <div class="space-x-2">
                      <RouterLink
                        :to="{ name: 'collection.edit', params: { id: collection.id } }"
                        class="badge badge__success"
                      >
                        View</RouterLink
                      >
                      <button @click="deleteCollection(collection.id)" class="badge badge__danger">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
