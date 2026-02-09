<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 3,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="form__group">
    <label :for="id" class="form__label" v-if="label">{{ label }}</label>
    <textarea
        :id="id"
        :name="name"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full px-2 py-1.5 border border-gray-200 focus:border-primary focus:outline-none focus:ring-0 rounded placeholder:text-sm disabled:bg-gray-100"
        :value="modelValue"
        @input="updateValue"
    ></textarea>
    <small v-if="error" class="text-danger">{{ error }}</small>
  </div>
</template>

<style scoped>

</style>
