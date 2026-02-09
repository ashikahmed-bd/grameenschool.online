<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue: [File, null],
    label: String,
    id: String,
    name: String,
    accept: { type: String, default: '' },
    required: { type: Boolean, default: false },
    error: String,
})

const emit = defineEmits(['update:modelValue'])

const uid = Math.random().toString(36).slice(2, 9)
const inputId = computed(() => props.id || `file-input-${uid}`)

const fileName = ref('')

function onChange(event) {
    const file = event.target.files?.[0] ?? null
    fileName.value = file ? file.name : ''
    emit('update:modelValue', file)
}
</script>

<template>
    <div class="mb-4">
        <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
            {{ label }}<span v-if="required" class="text-red-500">*</span>
        </label>

        <input type="file" :id="inputId" :name="name" :accept="accept" :required="required" class="block w-full text-sm text-gray-700 file:border file:border-gray-300 file:rounded file:px-3 file:py-2
        file:bg-white file:text-gray-700
        hover:file:text-primary
        cursor-pointer
        transition" @change="onChange" />
        <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </div>
</template>
