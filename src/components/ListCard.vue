<script setup>
import IconClose from '@/components/icons/IconClose.vue'
import IconPlus from '@/components/icons/IconPlus.vue'

defineProps({
  title: String,
  modelValue: String,
  items: {
    type: Array,
    default: () => [],
  },
  placeholder: String,
})

const emit = defineEmits(['update:modelValue', 'add', 'remove'])
</script>

<template>
  <div class="rounded-3xl bg-white p-5">
    <label class="mb-3 block text-sm font-bold text-gray-900">
      {{ title }}
    </label>

    <div class="relative">
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="w-full rounded border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        @input="emit('update:modelValue', $event.target.value)"
        @keydown.enter.prevent="emit('add')"
      />

      <button
        type="button"
        class="absolute right-1 top-1 grid size-10 place-items-center rounded bg-primary text-white"
        @click="emit('add')"
      >
        <IconPlus class="size-5" />
      </button>
    </div>

    <ul class="mt-4 space-y-2">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-4 text-sm"
      >
        <span>{{ item }}</span>

        <button
          type="button"
          class="grid size-7 place-items-center rounded-lg bg-red-50 text-red-500"
          @click="emit('remove', index)"
        >
          <IconClose class="size-4" />
        </button>
      </li>
    </ul>
  </div>
</template>
