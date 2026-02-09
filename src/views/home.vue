<script setup>
import Default from "@/layouts/Default.vue";
import { useAppStore } from "@/stores/app";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import IconGroup from "@/components/icons/IconGroup.vue";

const appStore = useAppStore();
const { home } = storeToRefs(appStore);

const loadDashboard = async () => {
  await appStore.dashboard();
}

const clearTokens = async () => {
  if (confirm('Are you sure you went to clear authenticate tokens? ')) {
    await appStore.ClearAllToken();
  }
}


onMounted(() => {
  loadDashboard();
})

</script>

<template>
  <Default>
    <section class="">
      <div v-if="home.stats" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Draft -->
        <div class="bg-white rounded-xl p-5 transition flex items-center gap-4 cursor-pointer">
          <div class="bg-white rounded-full">
            <img src="/icons/draft.png" alt="draft icon" class="h-16 w-16 object-contain" />
          </div>
          <div>
            <h6 class="text-gray-700 text-sm font-medium">Total Draft</h6>
            <p class="text-3xl font-semibold text-gray-900 mt-1">{{ home.stats?.total_draft }}</p>
          </div>
        </div>

        <!-- Pending -->
        <div class="bg-white rounded-xl p-5 transition flex items-center gap-4 cursor-pointer">
          <div class="bg-white rounded-full">
            <img src="/icons/pending.png" alt="pending" class="h-16 w-16 object-contain" />
          </div>
          <div>
            <h6 class="text-gray-600 text-sm font-medium">Total Pending</h6>
            <p class="text-3xl font-semibold text-gray-900 mt-1">{{ home.stats?.total_pending }}</p>
          </div>
        </div>

        <!-- Published -->
        <div class="bg-white rounded-xl p-5 transition flex items-center gap-4 cursor-pointer">
          <div class="bg-white rounded-full">
            <img src="/icons/published.png" alt="published" class="h-16 w-16 object-contain" />
          </div>
          <div>
            <h6 class="text-gray-600 text-sm font-medium">Total Published</h6>
            <p class="text-3xl font-semibold text-gray-900 mt-1">{{ home.stats?.total_published }}</p>
          </div>
        </div>

        <!-- Archived -->
        <div class="bg-white rounded-xl p-5 transition flex items-center gap-4 cursor-pointer">
          <div class="bg-white rounded-full">
            <img src="/icons/archived.png" alt="archived" class="h-16 w-16 object-contain" />
          </div>
          <div>
            <h6 class="text-gray-600 text-sm font-medium">Total Archived</h6>
            <p class="text-3xl font-semibold text-gray-900 mt-1">{{ home.stats?.total_archived }}</p>
          </div>
        </div>

        <!-- Student -->
        <div class="bg-white rounded-xl p-5 transition flex items-center gap-4 cursor-pointer">
          <div class="bg-white rounded-full">
            <img src="/icons/student.png" alt="student" class="h-16 w-16 object-contain" />
          </div>
          <div>
            <h6 class="text-gray-600 text-sm font-medium">Total Student</h6>
            <p class="text-3xl font-semibold text-gray-900 mt-1">{{ home.stats?.total_students }}</p>
          </div>
        </div>

        <!-- Agent -->
        <div class="bg-white rounded-xl p-5 transition flex items-center gap-4 cursor-pointer">
          <div class="bg-white rounded-full">
            <img src="/icons/enrolled.png" alt="agent" class="h-16 w-16 object-contain" />
          </div>
          <div>
            <h6 class="text-gray-600 text-sm font-medium">Total Enrolled</h6>
            <p class="text-3xl font-semibold text-gray-900 mt-1">{{ home.stats?.total_enrolled }}</p>
          </div>
        </div>

        <!-- Instructor -->
        <div class="bg-white rounded-xl p-5 transition flex items-center gap-4 cursor-pointer">
          <div class="bg-white rounded-full">
            <img src="/icons/instructor.png" alt="instructor" class="h-16 w-16 object-contain" />
          </div>
          <div>
            <h6 class="text-gray-600 text-sm font-medium">Total Instructor</h6>
            <p class="text-3xl font-semibold text-gray-900 mt-1">0</p>
          </div>
        </div>

        <!-- Courses -->
        <div class="bg-white rounded-xl p-5 transition flex items-center gap-4 cursor-pointer">
          <div class="bg-white rounded-full">
            <img src="/icons/courses.png" alt="courses" class="h-16 w-16 object-contain" />
          </div>
          <div>
            <h6 class="text-gray-600 text-sm font-medium">Total Courses</h6>
            <p class="text-3xl font-semibold text-gray-900 mt-1">0</p>
          </div>
        </div>
      </div>
    </section>


    <section class="">
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Recent Orders</h3>
        </div>

        <div class="card__body">
          <div class="relative overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Invoice ID</th>
                  <th>subtotal</th>
                  <th>discount</th>
                  <th>total</th>
                  <th>status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in home.recent_orders" :key="order.id">
                  <td>
                    <div class="flex items-center">
                      <img :src="order.user.avatar_url" :alt="order.user.name"
                        class="w-12 h-12 rounded-full border object-cover" />
                      <div class="ml-4">
                        <div class="font-medium text-gray-800">{{ order.user.name }}</div>
                        <div class="text-xs text-gray-500">{{ order.user.phone }}</div>
                      </div>
                    </div>
                  </td>
                  <td>#{{ order.invoice_id }}</td>
                  <td>{{ order.subtotal_formatted }}</td>
                  <td>{{ order.discount_formatted }}</td>
                  <td>{{ order.total_formatted }}</td>
                  <td>{{ order.status }}</td>
                  <td>
                    <RouterLink :to="{ name: 'orders.view', params: { id: order.id } }" class="badge badge__info">View
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>


    <section class="">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card">
          <div class="card__header">
            <h6 class="card__title">Top selling courses</h6>
          </div>

          <div class="card__body">
            <div class="relative overflow-y-auto">
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Enrolled</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in home.top_courses" :key="course.id">
                    <td>
                      <div class="flex items-center gap-3">
                        <img :src="course.cover_url" :alt="course.title"
                          class="object-cover h-12 w-auto rounded-md border" />
                        <div>
                          <h6 class="font-semibold whitespace-pre-wrap text-gray-800">{{ course.title }}
                          </h6>
                          <span v-if="course.price > 0">
                            {{ course.price_formatted }}
                            <span v-if="course.price < course.base_price"
                              class="text-sm text-gray-500 line-through ml-1">
                              {{ course.base_price_formatted }}
                            </span>
                          </span>
                          <span v-else class="text-green-600">Free</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div class="flex items-center gap-2">
                        <IconGroup class="size-5" />
                        <span class="text-base">{{ course.enrollments_count }}</span>
                      </div>
                    </td>

                    <td>
                      <div class="flex items-center gap-1 text-yellow-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.148 3.543a1 1 0 00.95.69h3.708c.969 0 1.371 1.24.588 1.81l-3 2.18a1 1 0 00-.364 1.118l1.148 3.543c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.49 2.54c-.784.57-1.838-.197-1.539-1.118l1.148-3.543a1 1 0 00-.364-1.118l-3-2.18c-.783-.57-.38-1.81.588-1.81h3.708a1 1 0 00.95-.69l1.148-3.543z" />
                        </svg>
                        {{ course.average_rating?.toFixed(1) ?? 'N/A' }} ({{ course.enrollments_count }})
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header">
            <h3 class="card__title">Latest Users</h3>
          </div>
          <div class="card__body">
            <div class="relative overflow-y-auto">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in home.latest_users" :key="user.id">
                    <td>
                      <div class="flex items-center ">
                        <img :src="user.avatar_url" :alt="user.name"
                          class="w-12 h-12 rounded-full border object-cover" />
                        <div class="ml-4">
                          <div class="font-medium text-gray-800">{{ user.name }}</div>
                          <div class="text-xs text-gray-500">{{ user.phone }}</div>
                        </div>
                      </div>
                    </td>
                    <td>{{ user.email ?? 'N/A' }}</td>
                    <td>{{ user.created_at.human }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">System Logs</h3>
          <button type="button" @click="clearTokens" class="base__button">Clear Logs</button>
        </div>
        <div class="card__body">
          <div class="relative overflow-y-auto">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Ip Address</th>
                  <th>Browser</th>
                  <th>Last Used </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in home.system_logs" :key="log.id">
                  <td>{{ log.name }}</td>
                  <td>{{ log.phone }}</td>
                  <td>
                    <span class="bg-gray-900 text-white text-xs capitalize px-2 py-0.5 rounded-full">{{ log.role
                    }}</span>
                  </td>
                  <td>{{ log.ip }}</td>
                  <td>{{ log.user_agent }}</td>
                  <td>{{ log.last_used_at }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </Default>

</template>

<style scoped></style>