<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  rows: {
    type: Number,
    default: 3,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <div class="form__group">
    <label v-if="label" class="form__label">
      {{ label }}
    </label>
    <textarea v-model="localValue" :placeholder="placeholder || `Enter ${label}`" :rows="rows" :readonly="readonly"
      class="form__control resize-y"></textarea>
    <small v-if="error" class="text-xs text-red-500">
      {{ error }}
    </small>
  </div>
</template>

<style scoped></style>
