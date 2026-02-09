<script setup>
import draggable from 'vuedraggable'

import BaseInput from '@/components/BaseInput.vue'
import IconDelete from '@/components/icons/IconDelete.vue'
import IconMenu from '@/components/icons/IconMenu.vue'

defineProps({
  title: String,
  itemKeyName: String,
  items: Array,
})

const emit = defineEmits(['update'])
</script>

<template>
  <form class="space-y-2 p-4">
    <h3 class="text-base font-semibold">{{ title }}</h3>

    <draggable
      :list="items"
      ghost-class="bg-gray-200"
      handle=".move"
      @change="emit('update', itemKeyName)"
    >
      <template #item="{ index }">
        <div class="group flex items-center gap-2">
          <div class="flex-1">
            <BaseInput placeholder="Enter text" v-model="items[index]" />
          </div>

          <div
            class="flex-none space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <button class="move cursor-move">
              <IconMenu class="size-5" />
            </button>

            <button class="text-red-500 hover:text-red-600" @click.prevent="items.splice(index, 1)">
              <IconDelete class="size-5" />
            </button>
          </div>
        </div>
      </template>
    </draggable>

    <button
      type="button"
      class="flex items-center gap-1 cursor-pointer border border-gray-400 rounded px-2 py-0.5 text-sm hover:underline"
      @click="items.push('')"
    >
      Add item
    </button>
  </form>
</template>
