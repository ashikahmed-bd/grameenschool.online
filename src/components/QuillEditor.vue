<script setup>
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Write something...',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 260,
  },
  error: {
    type: [String, Array],
    default: '',
  },
  help: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const editorRef = ref(null)
let quill = null

const toolbarOptions = [
  [{ header: [2, 3, 4, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],
  ['clean'],
]

const normalizeHtml = (html) => {
  if (!html || html === '<p><br></p>') return ''
  return html
}

onMounted(async () => {
  await nextTick()

  quill = new Quill(editorRef.value, {
    theme: 'snow',
    placeholder: props.placeholder,
    readOnly: props.readOnly,
    modules: {
      toolbar: toolbarOptions,
    },
  })

  const editor = editorRef.value.querySelector('.ql-editor')
  if (editor) {
    editor.style.minHeight = `${props.height}px`
  }

  quill.root.innerHTML = props.modelValue || ''

  quill.on('text-change', () => {
    const html = normalizeHtml(quill.root.innerHTML)

    emit('update:modelValue', html)
    emit('change', html)
  })
})

watch(
  () => props.modelValue,
  (value) => {
    if (!quill) return

    const current = normalizeHtml(quill.root.innerHTML)
    const incoming = value || ''

    if (incoming !== current) {
      const selection = quill.getSelection()
      quill.root.innerHTML = incoming

      if (selection) {
        quill.setSelection(selection.index, selection.length)
      }
    }
  },
)

watch(
  () => props.readOnly,
  (value) => {
    if (quill) {
      quill.enable(!value)
    }
  },
)

onBeforeUnmount(() => {
  quill = null
})
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-semibold text-gray-800">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div
      class="quill-wrapper overflow-hidden rounded-2xl border bg-white transition"
      :class="[
        error
          ? 'border-red-300 ring-2 ring-red-50'
          : 'border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10',
        readOnly ? 'opacity-70' : '',
      ]"
    >
      <div ref="editorRef"></div>
    </div>

    <p v-if="error" class="text-sm text-red-500">
      {{ Array.isArray(error) ? error[0] : error }}
    </p>

    <p v-else-if="help" class="text-sm text-gray-500">
      {{ help }}
    </p>
  </div>
</template>

<style scoped>
.quill-wrapper :deep(.ql-toolbar) {
  border: 0;
  border-bottom: 1px solid rgb(229 231 235);
}

.quill-wrapper :deep(.ql-container) {
  border: 0;
}
</style>
