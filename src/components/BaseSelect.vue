<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  label: String,
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: String,
  error: [String, Array],
  required: Boolean,
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <select
      class="w-full block px-4 py-2 border border-gray-300 rounded bg-white text-sm text-gray-700 focus:outline-none focus:ring-0 focus:border-primary transition"
      :value="modelValue" @change="emit('update:modelValue', $event.target.value)">
      <option value="" disabled="">
        {{ placeholder }}
      </option>

      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
    </select>

    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>
