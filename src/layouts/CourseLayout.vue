<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="bg-dark sticky top-0 z-40 text-white py-4 shadow">
    <div class="max-w-7xl mx-auto">
      <nav class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <RouterLink :to="{ name: 'courses' }" class="underline"> Back to Courses </RouterLink>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-semibold">
              The Complete Python Bootcamp From Zero to Hero in Python
            </h3>
            <span
              class="capitalize rounded-full text-sm px-2.5 inline-flex"
              :class="true ? 'bg-green-600' : 'bg-gray-600'"
              >Draft</span
            >
          </div>
        </div>
      </nav>
    </div>
  </header>

  <div class="max-w-7xl mx-auto my-4">
    <div class="grid grid-cols-12 gap-4">
      <aside class="col-span-3 bg-white p-4 rounded-2xl">
        <nav class="space-y-2">
          <RouterLink
            :to="{ name: 'course.basic', params: { id: route.params.id } }"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary-800 transition"
            active-class="bg-gray-100 text-primary-800 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m4 0h5a1 1 0 001-1V10"
              />
            </svg>

            <span>Course landing page</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'course.targets', params: { id: route.params.id } }"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary-800 transition"
            active-class="bg-gray-100 text-primary-800 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>

            <span>Course targets</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'course.curriculum', params: { id: route.params.id } }"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary-800 transition"
            active-class="bg-gray-100 text-primary-800 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>

            <span>Course curriculum</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'course.pricing', params: { id: route.params.id } }"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-primary-800 transition"
            active-class="bg-gray-100 text-primary-800 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2
           3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2"
              />
            </svg>

            <span>Prices and promotions</span>
          </RouterLink>
        </nav>

        <button class="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm">
          {{ true ? 'Unpublish' : 'Publish' }} COURSE
        </button>
      </aside>
      <main class="col-span-9 mb-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
