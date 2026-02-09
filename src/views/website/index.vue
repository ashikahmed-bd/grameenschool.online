<script setup>
import { useRoute } from 'vue-router'
import Default from "@/layouts/Default.vue";

const route = useRoute();

const tabs = [
  { name: 'WebHomepage', label: 'Homepage', to: '/website/homepage' },
  { name: 'WebContact', label: 'Contact', to: '/website/contact' },
  { name: 'WebAbout', label: 'About Us', to: '/website/about' },
]
</script>


<template>
  <Default>
    <div class="card">
      <div class="card__body">
        <!-- Tabs -->
        <div class="flex gap-6 border-b border-gray-200 mb-6">
          <router-link v-for="tab in tabs" :key="tab.name" :to="tab.to" class="text-sm font-medium pb-2 border-b-2"
            :class="{
              'border-primary text-dark': route.name === tab.name,
              'border-transparent text-dark hover:text-primary': route.name !== tab.name,
            }">
            {{ tab.label }}
          </router-link>
        </div>

        <!-- Render tab content -->
        <router-view />
      </div>
    </div>
  </Default>

</template>
