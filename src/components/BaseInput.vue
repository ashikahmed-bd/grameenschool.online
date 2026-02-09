<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  id: String,
  name: String,

  type: {
    type: String,
    default: 'text',
  },

  placeholder: {
    type: String,
    default: '',
  },

  error: {
    type: [String, Array],
    default: '',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  required: {
    type: Boolean,
    default: false,
  },

  autocomplete: {
    type: String,
    default: 'off',
  },
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>

    <input :type="type" :id="id" :name="name" :value="modelValue" :placeholder="placeholder" :disabled="disabled"
      :autocomplete="autocomplete" @input="updateValue"
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      :class="{
        'border-danger ring-red-100': error,
        'border-gray-300': !error
      }" />

    <small v-if="error" class="text-danger text-sm mt-1">
      {{ Array.isArray(error) ? error[0] : error }}
    </small>
  </div>
</template>