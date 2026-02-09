<script setup>
import Default from '@/layouts/Default.vue'
import { ref, watch } from 'vue'
import DataTableSkeleton from '@/components/DataTableSkeleton.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const users = ref([])

// filters
const selectedRole = ref('')
const search_term = ref('')

// load users
const loadUsers = async (page = 1) => {
  const response = await userStore.all(page, {
    query: search_term.value,
    role: selectedRole.value,
  })
  users.value = response
}

// initial load
loadUsers()

// watch role change
watch(selectedRole, () => {
  loadUsers()
})

// optional: instant search when typing (debounced)
let searchTimeout
watch(search_term, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadUsers()
  }, 400)
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Users List</h3>
        <div class="flex items-center gap-2">
          <label>
            <input
              type="search"
              v-model="search_term"
              class="form__control"
              placeholder="Enter search keywords..."
              @keyup.enter="loadUsers()"
            />
          </label>

          <select v-model="selectedRole" class="form__select">
            <option value="">All</option>
            <option value="admin">Admin</option>
            <option value="author">Author</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>

          <RouterLink :to="{ name: 'users.create' }" class="base__button"> Add New </RouterLink>
        </div>
      </div>

      <div class="card__body">
        <template v-if="users.data">
          <table>
            <thead class="thead">
              <tr>
                <th>Photo</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="tbody">
              <tr v-for="user in users.data" :key="user.id">
                <td>
                  <div class="flex items-center">
                    <img
                      :src="user.avatar_url"
                      :alt="user.name"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div class="ml-2">
                      <h4>{{ user.name }}</h4>
                      <span class="font-normal text-xs">@{{ user.username }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ user.phone }}</td>
                <td>{{ user.email ?? 'N/A' }}</td>
                <td>
                  <span
                    v-if="user.role === 'admin'"
                    class="bg-indigo-500 text-white px-2 py-0.5 rounded-full text-xs"
                    >Admin</span
                  >
                  <span
                    v-else-if="user.role === 'instructor'"
                    class="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs"
                    >Instructor</span
                  >
                  <span
                    v-else-if="user.role === 'author'"
                    class="bg-cyan-500 text-white px-2 py-0.5 rounded-full text-xs"
                    >Author</span
                  >
                  <span v-else class="bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs"
                    >Student</span
                  >
                </td>
                <td>
                  <span
                    v-if="user.disabled"
                    class="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs"
                    >Disabled</span
                  >
                  <span v-else class="bg-primary text-white px-2 py-0.5 rounded-full text-xs"
                    >Enabled</span
                  >
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <RouterLink
                      :to="{ name: 'users.make_instructor', params: { id: user.id } }"
                      title="Make Instructor"
                      v-if="user.role != 'instructor'"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        class="size-5"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
                        />
                        <path
                          d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492z"
                        />
                      </svg>
                    </RouterLink>
                    <RouterLink
                      v-if="user.referral"
                      :to="{ name: 'users.referral_apply', params: { id: user.id } }"
                      title="Referral Apply"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </RouterLink>
                    <RouterLink
                      :to="{ name: 'users.view', params: { id: user.id } }"
                      title="View Users"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                        />
                      </svg>
                    </RouterLink>
                    <RouterLink
                      :to="{ name: 'users.edit', params: { id: user.id } }"
                      title="Edit Users"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <Pagination
            class="mt-4"
            v-if="users.meta"
            :total-items="users.meta.total"
            :current-page="users.meta.current_page"
            :items-per-page="users.meta.per_page"
            :pages-to-show="2"
            @page-change="loadUsers"
            visible-always
          />
        </template>
        <template v-else>
          <DataTableSkeleton />
        </template>
      </div>
    </div>
  </Default>
</template>
