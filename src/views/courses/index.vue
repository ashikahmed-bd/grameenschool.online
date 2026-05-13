<script setup>
import Default from '@/layouts/Default.vue'
import DataTableSkeleton from '@/components/DataTableSkeleton.vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconGroup from '@/components/icons/IconGroup.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '@/stores/course'
import IconClock from '@/components/icons/IconClock.vue'

const courseStore = useCourseStore()
const { courses } = storeToRefs(courseStore)

const getCourses = async (page = 1) => {
  try {
    await courseStore.all(page)
  } catch (error) {
    console.error('Error fetching courses:', error)
  }
}

const deleteCourse = async (id) => {
  if (confirm('Are you sure you want to delete this course?')) {
    try {
      await courseStore.delete(id)
      await getCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }
}

onMounted(() => {
  getCourses()
})
</script>

<template>
  <Default>
    <section class="py-4">
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Courses List</h3>
          <RouterLink :to="{ name: 'course.create' }" class="base__button">Create</RouterLink>
        </div>

        <div class="card__body">
          <template v-if="courses && courses.data">
            <div class="relative overflow-y-auto">
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Categories</th>
                    <th>Price</th>
                    <th>Featured</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in courses.data">
                    <td>
                      <div class="flex items-center gap-2">
                        <img :src="course.cover_url" :alt="course.name" class="h-12 w-auto object-cover rounded" />
                        <div class="max-w-3xs">
                          <h6 class="font-medium text-dark truncate">
                            {{ course.title }}
                          </h6>
                          <div class="flex flex-wrap">
                            <span
                              class="font-normal after:content-['•'] after:mx-2 last:after:content-none flex items-center">
                              <IconPlay class="size-4 mr-1" /> {{ course.lectures_count }} Lessons
                            </span>
                            <span class="font-normal after:content-['•'] last:after:content-none flex items-center">
                              <IconClock class="size-4 mr-1" /> {{ course.stats?.total_hrs }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="space-y-1">
                        <div class="text-xs font-semibold text-dark">
                          {{ course.category?.name }}
                        </div>

                        <div v-if="course.subcategory" class="text-xs text-muted">
                          ↳ {{ course.subcategory?.name }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="flex items-center gap-2">
                        <span class="text-primary">
                          {{ course.price_formatted }}
                        </span>
                        <del v-if="course.base_price && course.base_price > course.price" class="text-gray-400">
                          {{ course.base_price_formatted }}
                        </del>
                      </div>
                    </td>
                    <td>
                      <span v-if="course.is_feature">Yes</span>
                      <span v-else>No</span>
                    </td>
                    <td>
                      <div class="flex items-center gap-2">
                        <IconGroup class="size-5" />
                        <span class="font-normal">{{ course.students_count }}</span>
                      </div>
                    </td>

                    <td>
                      <span class="capitalize text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{{ course.status
                      }}</span>
                    </td>
                    <td class="text-right">
                      <div class="flex items-center gap-2 text-gray-500">
                        <RouterLink :to="{ name: 'course.basic', params: { id: course.id } }"
                          class="badge badge__primary">
                          View
                        </RouterLink>
                        <button type="button" @click.prevent="deleteCourse(course.id)" class="badge badge__danger">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Pagination v-if="courses.data" class="mt-4" :total-items="courses.meta.total"
              :current-page="courses.meta.current_page" :items-per-page="courses.meta.per_page" :pages-to-show="2"
              @page-change="getCourses" visible-always />
          </template>

          <template v-else>
            <DataTableSkeleton />
          </template>
        </div>
      </div>
    </section>
  </Default>
</template>

<style scoped></style>
