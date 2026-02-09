<script setup>
import Curriculum from '@/components/Curriculum.vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import { useCourseStore } from '@/stores/course.js'
import { useSectionStore } from '@/stores/section.js'
import { useToastStore } from '@/stores/toast.js'
import { useLectureStore } from '@/stores/lecture.js'
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseDialog from '@/components/BaseDialog.vue'
import BaseButton from '@/components/BaseButton.vue'
import IconLock from '@/components/icons/IconLock.vue'
import IconUnlock from '@/components/icons/IconUnlock.vue'
import { storeToRefs } from 'pinia'
import axios from 'axios'
const route = useRoute()

const courseStore = useCourseStore()
const sectionStore = useSectionStore()
const toastStore = useToastStore()
const lectureStore = useLectureStore()

const { curriculum } = storeToRefs(courseStore)

const loadCurriculum = async () => {
  await courseStore.getCurriculum(route.params.id)
}

// Dialog visibility states
const showSectionDialog = ref(false)
const updateSectionDialog = ref(false)
const selectedSectionId = ref(null)

const showLectureDialog = ref(false)

const section = reactive({
  title: '',
  icon: null,
  icon_url: '',
})

const addSection = async () => {
  const formData = new FormData()
  formData.append('title', section.title)
  if (section.icon) {
    formData.append('icon', section.icon)
  }
  const response = await sectionStore.store(route.params.id, formData)

  if (response.success === true) {
    showSectionDialog.value = false
    toastStore.success(response.message)
  }
  await loadCurriculum()
}

const loadSection = (sectionData) => {
  selectedSectionId.value = sectionData.id
  section.title = sectionData.title
  section.icon_url = sectionData.icon_url
  updateSectionDialog.value = true
}

const updateSection = async () => {
  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('title', section.title)
  if (section.icon) {
    formData.append('icon', section.icon)
  }

  const response = await sectionStore.update(route.params.id, selectedSectionId.value, formData)

  if (response.success === true) {
    updateSectionDialog.value = false
    toastStore.success(response.message)
    await loadCurriculum()
  }
}

const deleteSection = async (sectionId) => {
  if (confirm('Are you sure you went to deleted this section?')) {
    await sectionStore.delete(route.params.id, sectionId)
    await loadCurriculum()
  }
}

const lecture = reactive({
  title: '',
  type: 'video',
  overview: '',
  video_id: '',
  provider: 'youtube',
  duration: '',
  is_preview: false,
})

function parseYouTubeDuration(isoDuration) {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0
  const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0

  // Format with leading zeros
  const hh = hours.toString().padStart(2, '0')
  const mm = minutes.toString().padStart(2, '0')
  const ss = seconds.toString().padStart(2, '0')

  return `${hh}:${mm}:${ss}`
}

const getVideoDuration = async () => {
  if (lecture.provider === 'youtube') {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        id: lecture.video_id,
        part: 'contentDetails',
        key: import.meta.env.VITE_YOUTUBE_API_KEY,
      },
    })

    const durationISO = response.data.items[0].contentDetails.duration
    lecture.duration = parseYouTubeDuration(durationISO)
  }

  if (lecture.provider === 'vimeo') {
    const response = await axios.get(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${lecture.video_id}`,
    )

    const seconds = response.data.duration

    const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const sec = seconds % 60

      return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        sec.toString().padStart(2, '0'),
      ].join(':')
    }
    lecture.duration = formatDuration(seconds)
  } else {
    lecture.duration = '00:00:00'
  }
}

const openLectureDialog = (sectionId) => {
  showLectureDialog.value = true
  selectedSectionId.value = sectionId
}

const handleLecture = async () => {
  const response = await lectureStore.store(route.params.id, selectedSectionId.value, lecture)
  if (response.success === true) {
    showLectureDialog.value = false
    toastStore.success(response.message)
  }
  await loadCurriculum()
}

const updateLectureDialog = ref(false)
const selectedLectureId = ref(null)

const loadLecture = (lectureData) => {
  selectedLectureId.value = lectureData.id
  lecture.title = lectureData.title
  lecture.type = lectureData.type
  lecture.overview = lectureData.overview
  lecture.video_id = lectureData.video_id
  lecture.duration = lectureData.duration
  lecture.provider = lectureData.provider
  lecture.is_preview = lectureData.is_preview

  updateLectureDialog.value = true
}

const lectureUpdate = async () => {
  const response = await lectureStore.update(route.params.id, selectedLectureId.value, lecture)
  if (response.success === true) {
    updateLectureDialog.value = false
    toastStore.success(response.message)
  }
  await loadCurriculum()
}

const lectureDelete = async (lecture) => {
  if (confirm('Are you sure you went to deleted this lecture?')) {
    await lectureStore.delete(route.params.id, lecture)
    await loadCurriculum()
  }
}

onMounted(() => {
  loadCurriculum()
})
</script>

<template>
  <div class="card w-full border border-border">
    <div class="card__header">
      <h3 class="card__title">Course Curriculum</h3>
      <button @click.prevent="showSectionDialog = true" class="base__button cursor-pointer">
        Add Section
      </button>
    </div>

    <div v-if="curriculum.data" class="card__body">
      <article
        v-for="section in curriculum.data"
        :key="section.id"
        class="mb-6 border border-border rounded-md bg-gray-50"
      >
        <div class="bg-white border-b border-border flex items-center justify-between p-4">
          <div class="flex space-x-2">
            <img :src="section.icon_url" :alt="section.title" class="size-6" />
            <h3 class="font-semibold text-dark">{{ section.title }}</h3>
          </div>
          <div class="space-x-2">
            <button
              type="button"
              @click.prevent="loadSection(section)"
              class="badge badge__info text-sm"
            >
              Edit
            </button>
            <button
              type="button"
              @click.prevent="deleteSection(section.id)"
              class="badge badge__danger text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <ul class="space-y-2 p-4">
          <li v-for="lecture in section.lectures" :key="lecture.id">
            <div class="flex justify-between items-center">
              <div class="relative flex items-center">
                <a
                  href="#"
                  class="text-white bg-primary hover:bg-opacity-90 rounded-full p-2 text-sm inline-flex items-center justify-center"
                >
                  <IconPlay class="size-4" />
                </a>
                <div class="ml-2">
                  <h3 class="text-base font-light">{{ lecture.title }}</h3>
                  <span class="flex items-center text-sm"
                    >{{ lecture.duration ?? '00:00:00' }}
                    <IconUnlock v-if="lecture.is_preview" class="size-3 ml-2" />
                    <IconLock v-else class="size-3 ml-2" />
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click.prevent="loadLecture(lecture)"
                  class="cursor-pointer text-green-600 bg-green-100 hover:bg-green-200 rounded-full px-3 py-1 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  @click="lectureDelete(lecture.id)"
                  class="cursor-pointer text-red-600 bg-red-100 hover:bg-red-200 rounded-full px-3 py-1 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div class="p-4">
          <button type="button" @click.prevent="openLectureDialog(section.id)" class="base__button">
            Add Lecture
          </button>
        </div>
      </article>
    </div>
  </div>

  <!-- add Section Dialog -->
  <BaseDialog :show="showSectionDialog" title="Add New Section" @close="showSectionDialog = false">
    <form @submit.prevent="addSection">
      <div class="form__group">
        <label class="form__label">Section Title</label>
        <input
          type="text"
          v-model="section.title"
          placeholder="Section Title"
          class="form__control"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Icon</label>
        <input type="file" @change="(e) => (section.icon = e.target.files[0])" class="form__file" />
      </div>

      <BaseButton :loading="sectionStore.loading" class="w-full">Submit</BaseButton>
    </form>
  </BaseDialog>

  <!-- update Section Dialog -->
  <BaseDialog
    :show="updateSectionDialog"
    title="Update Section"
    @close="updateSectionDialog = false"
  >
    <form @submit.prevent="updateSection" enctype="multipart/form-data">
      <div class="form__group">
        <label class="form__label">Section Title</label>
        <input
          type="text"
          v-model="section.title"
          placeholder="Section Title"
          class="form__control"
        />
      </div>
      <div class="flex items-center gap-2">
        <div class="form__group">
          <label class="form__label">Icon</label>
          <input
            type="file"
            @change="(e) => (section.icon = e.target.files[0])"
            class="form__file"
          />
        </div>
        <img :src="section.icon_url" :alt="section.title" class="size-12" />
      </div>
      <BaseButton :loading="sectionStore.loading" class="w-full">Submit</BaseButton>
    </form>
  </BaseDialog>

  <!-- create Lecture Dialog -->
  <BaseDialog :show="showLectureDialog" title="Add New Lecture" @close="showLectureDialog = false">
    <form @submit.prevent="handleLecture">
      <div class="form__group">
        <label class="form__label">Title</label>
        <input
          type="text"
          v-model="lecture.title"
          class="form__control"
          placeholder="Lecture Title"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Type</label>
        <select v-model="lecture.type" class="form__select w-full">
          <option value="video">Video</option>
          <option value="content">Content</option>
        </select>
      </div>

      <div class="form__group">
        <label class="form__label">Overview</label>
        <textarea
          v-model="lecture.overview"
          class="form__control"
          placeholder="Lecture overview"
        ></textarea>
      </div>

      <div v-if="lecture.type === 'video'" class="grid grid-cols-3 gap-4">
        <div class="form__group">
          <label class="form__label">Provider</label>
          <select v-model="lecture.provider" class="form__select w-full">
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
          </select>
        </div>
        <div class="form__group">
          <label class="form__label">Video ID</label>
          <input
            type="text"
            v-model="lecture.video_id"
            class="form__control"
            @input="getVideoDuration"
            placeholder="e.g. bTqVqk7FSmY"
          />
        </div>
        <div class="form__group">
          <label class="form__label">Duration (HH:MM:SS)</label>
          <input
            type="text"
            v-model="lecture.duration"
            class="form__control"
            placeholder="e.g. 00:10:45"
            pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
          />
        </div>
      </div>

      <div class="form__group">
        <div class="inline-flex" role="group" aria-label="Lecture options">
          <!-- Free -->
          <input
            type="radio"
            id="free"
            :value="true"
            v-model="lecture.is_preview"
            class="hidden peer"
          />
          <label
            for="free"
            :class="[
              'px-2 py-1 text-sm font-medium rounded-l cursor-pointer border border-border',
              lecture.is_preview === true
                ? 'bg-primary text-white border-border'
                : 'bg-white text-dark hover:bg-opacity-90',
            ]"
          >
            Free
          </label>

          <!-- Premium -->
          <input
            type="radio"
            id="premium"
            :value="false"
            v-model="lecture.is_preview"
            class="hidden peer"
          />
          <label
            for="premium"
            :class="[
              'px-2 py-1 text-sm font-medium rounded-r cursor-pointer border border-border',
              lecture.is_preview === false
                ? 'bg-primary text-white border-blue-600'
                : 'bg-white text-dark hover:bg-opacity-90',
            ]"
          >
            Premium
          </label>
        </div>
      </div>

      <div class="flex items-end justify-end">
        <BaseButton :loading="lectureStore.loading">Submit</BaseButton>
      </div>
    </form>
  </BaseDialog>

  <!-- update Lecture Dialog -->
  <BaseDialog
    :show="updateLectureDialog"
    title="Update Lecture"
    @close="updateLectureDialog = false"
  >
    <form @submit.prevent="lectureUpdate">
      <div class="form__group">
        <label class="form__label">Title</label>
        <input
          type="text"
          v-model="lecture.title"
          class="form__control"
          placeholder="Lecture Title"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Type</label>
        <select v-model="lecture.type" class="form__select w-full">
          <option value="video">Video</option>
          <option value="content">Content</option>
        </select>
      </div>

      <div class="form__group">
        <label class="form__label">Overview</label>
        <textarea
          v-model="lecture.overview"
          class="form__control"
          placeholder="Lecture overview"
        ></textarea>
      </div>

      <div v-if="lecture.type === 'video'" class="grid grid-cols-3 gap-4">
        <div class="form__group">
          <label class="form__label">Provider</label>
          <select v-model="lecture.provider" class="form__select w-full">
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
          </select>
        </div>
        <div class="form__group">
          <label class="form__label">Video ID</label>
          <input
            type="text"
            v-model="lecture.video_id"
            class="form__control"
            @input="getVideoDuration"
            placeholder="e.g. bTqVqk7FSmY"
          />
        </div>
        <div class="form__group">
          <label class="form__label">Duration (HH:MM:SS)</label>
          <input
            type="text"
            v-model="lecture.duration"
            class="form__control"
            placeholder="e.g. 00:10:45"
            pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
          />
        </div>
      </div>

      <div class="form__group">
        <div class="inline-flex" role="group" aria-label="Lecture options">
          <!-- Free -->
          <input
            type="radio"
            id="free"
            :value="true"
            v-model="lecture.is_preview"
            class="hidden peer"
          />
          <label
            for="free"
            :class="[
              'px-2 py-1 text-sm font-medium rounded-l cursor-pointer border border-border',
              lecture.is_preview === true
                ? 'bg-primary text-white border-border'
                : 'bg-white text-dark hover:bg-opacity-90',
            ]"
          >
            Free
          </label>

          <!-- Premium -->
          <input
            type="radio"
            id="premium"
            :value="false"
            v-model="lecture.is_preview"
            class="hidden peer"
          />
          <label
            for="premium"
            :class="[
              'px-2 py-1 text-sm font-medium rounded-r cursor-pointer border border-border',
              lecture.is_preview === false
                ? 'bg-primary text-white border-blue-600'
                : 'bg-white text-dark hover:bg-opacity-90',
            ]"
          >
            Premium
          </label>
        </div>
      </div>

      <div class="flex items-end justify-end">
        <BaseButton :loading="lectureStore.loading">Submit</BaseButton>
      </div>
    </form>
  </BaseDialog>
</template>

<style scoped></style>
