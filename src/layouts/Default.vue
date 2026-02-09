<script setup>
import { ref, onMounted } from 'vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconList from '@/components/icons/IconList.vue'
import IconMegaPhone from '@/components/icons/IconMegaPhone.vue'
import IconGroup from '@/components/icons/IconGroup.vue'
import IconSettings from '@/components/icons/IconSettings.vue'
import IconPower from '@/components/icons/IconPower.vue'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth.js'
import { useProfileStore } from '@/stores/profile.js'
import IconFlim from '@/components/icons/IconFlim.vue'
import IconStar from '@/components/icons/IconStar.vue'
import IconDocument from '@/components/icons/IconDocument.vue'
import IconPayout from '@/components/icons/IconPayout.vue'
import IconTv from '@/components/icons/IconTv.vue'
import IconProfile from '@/components/icons/IconProfile.vue'
import { useAppStore } from '@/stores/app'
import IconBar from '@/components/icons/IconBar.vue'
import IconServer from '@/components/icons/IconServer.vue'
import IconContact from '@/components/icons/IconContact.vue'
import IconGift from '@/components/icons/IconGift.vue'
import IconBundle from '@/components/icons/IconBundle.vue'

const appStore = useAppStore()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const { user } = storeToRefs(authStore)
const { settings } = storeToRefs(appStore)

const logout = async () => {
  if (confirm('Do you really want to logout?')) {
    await profileStore.logout()
  }
}

const cacheClear = async () => {
  if (confirm('Are you sure you want to clear the cache?')) {
    await appStore.cacheClear()
  }
}

const loading = ref(true)

onMounted(() => {
  appStore.getSettings()

  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<template>
  <div class="h-screen">
    <!-- Sidebar: Fixed -->
    <aside class="w-60 hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-30 bg-white">
      <!-- Header Section -->
      <div class="bg-white flex items-center gap-2 px-2 py-3">
        <img v-if="settings.branding" :src="settings.branding?.favicon" class="h-10 w-auto" />
        <div class="">
          <div class="font-semibold">{{ settings.general?.site_name }}</div>
          <div class="text-xs text-gray-500">{{ settings.general?.tagline }}</div>
        </div>
      </div>

      <!-- Scrollable Nav Section -->
      <nav class="bg-white flex-1 overflow-y-auto scrollbar px-2 py-4 space-y-2">
        <RouterLink :to="{ name: 'home' }" class="nav__item">
          <IconHome class="size-5" />
          <span class="ml-3">Dashboard</span>
        </RouterLink>
        <RouterLink :to="{ name: 'categories' }" class="nav__item">
          <IconList class="size-5" />
          <span class="ml-3">Categories</span>
        </RouterLink>
        <RouterLink :to="{ name: 'courses' }" class="nav__item">
          <IconFlim class="size-5" />
          <span class="ml-3">Courses</span>
        </RouterLink>
        <RouterLink :to="{ name: 'bundles' }" class="nav__item">
          <IconBundle class="size-5" />
          <span class="ml-3">Bundles</span>
        </RouterLink>
        <RouterLink :to="{ name: 'meets' }" class="nav__item">
          <IconTv class="size-5" />
          <span class="ml-2">Live Class</span>
        </RouterLink>
        <RouterLink :to="{ name: 'notices' }" class="nav__item">
          <IconMegaPhone class="size-5" />
          <span class="ml-2">Notices</span>
        </RouterLink>
        <RouterLink :to="{ name: 'payouts' }" class="nav__item">
          <IconPayout class="size-5" />
          <span class="ml-2">Payouts</span>
        </RouterLink>

        <RouterLink :to="{ name: 'orders' }" class="nav__item">
          <IconDocument class="size-5" />
          <span class="ml-2">Orders</span>
        </RouterLink>
        <RouterLink :to="{ name: 'reviews' }" class="nav__item">
          <IconStar class="size-5" />
          <span class="ml-2">Reviews</span>
        </RouterLink>
        <RouterLink :to="{ name: 'users' }" class="nav__item">
          <IconGroup class="size-5" />
          <span class="ml-2">Users</span>
        </RouterLink>
        <RouterLink :to="{ name: 'benefits' }" class="nav__item">
          <IconGift class="size-5" />
          <span class="ml-2">Benefits</span>
        </RouterLink>
        <RouterLink :to="{ name: 'contacts' }" class="nav__item">
          <IconContact class="size-5" />
          <span class="ml-2">Contacts</span>
        </RouterLink>
        <RouterLink :to="{ name: 'profile' }" class="nav__item">
          <IconProfile class="size-5" />
          <span class="ml-2">Profile</span>
        </RouterLink>
        <RouterLink :to="{ name: 'settings' }" class="nav__item">
          <IconSettings class="size-5" />
          <span class="ml-2">Settings</span>
        </RouterLink>
        <RouterLink :to="{ name: 'website' }" class="nav__item">
          <IconSettings class="size-5" />
          <span class="ml-2">Website Settings</span>
        </RouterLink>
        <button type="button" @click="cacheClear()" class="nav__item w-full">
          <IconServer class="size-5" />
          <span class="ml-2">Cache Clear</span>
        </button>
        <button type="button" @click="logout" class="nav__item w-full">
          <IconPower class="size-5" />
          <span class="ml-2">Logout</span>
        </button>
      </nav>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col md:ml-60">
      <!-- Header: Sticky -->
      <header class="bg-white sticky top-0 z-30 px-4 py-3 flex items-center">
        <div class="flex-grow">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button
                type="button"
                class="bg-gray-100 p-2 rounded-full cursor-pointer hover:opacity-70 transition duration-200"
              >
                <IconBar class="size-6" />
              </button>
              <input type="search" class="form__control max-w-md" placeholder="Enter keywords..." />
            </div>

            <div class="flex-none">
              <button type="button" class="flex items-center gap-2 cursor-pointer">
                <img :src="user.avatar_url" :alt="user.name" class="w-8 h-8 rounded-full" />
                <div class="text-left">
                  <p class="text-sm font-semibold">{{ user.name }}</p>
                  <p class="text-xs lowercase">{{ user.email }}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="space-y-4 m-4 rounded-xl flex-1">
        <div v-if="loading" class="bg-white h-dvh rounded-xl text-center py-10">
          <img src="/loader.gif" alt="Loading..." class="mx-auto w-48 h-48" />
        </div>
        <slot v-else />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
