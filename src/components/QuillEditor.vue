<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Important: must be imported globally or here

const props = defineProps({
    modelValue: { type: String, default: "" },
    label: { type: String, default: "" },
    placeholder: { type: String, default: "Write something..." },
    readOnly: { type: Boolean, default: false },
    height: { type: Number, default: 200 },
});

const emit = defineEmits(["update:modelValue"]);

const editorContainer = ref(null);
let quill = null;

onMounted(() => {
    quill = new Quill(editorContainer.value, {
        theme: "snow",
        placeholder: props.placeholder,
        readOnly: props.readOnly,
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ script: "sub" }, { script: "super" }],
                [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ align: [] }],
                ["blockquote", "code-block"],
                ["link", "image", "video"],
                ["clean"],
            ],
        },
    });

    // Set editor height
    const editorEl = editorContainer.value.querySelector(".ql-editor");
    if (editorEl) {
        editorEl.style.minHeight = `${props.height}px`;
    }

    // Initialize editor content
    quill.root.innerHTML = props.modelValue || "";

    // Emit on change
    quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        emit("update:modelValue", html);
    });
});

// Watch external model changes
watch(
    () => props.modelValue,
    (newVal) => {
        if (quill && newVal !== quill.root.innerHTML) {
            quill.root.innerHTML = newVal || "";
        }
    }
);

onBeforeUnmount(() => {
    quill = null;
});
</script>

<template>
    <div class="mb-3">
        <label v-if="label" class="block text-sm font-medium mb-2">{{ label }}</label>
        <div ref="editorContainer" class="border border-gray-300 rounded-md"></div>
    </div>
</template>

<style scoped>
 
</style>
