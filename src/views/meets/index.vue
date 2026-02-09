<script setup>
import Default from "@/layouts/Default.vue";
import { reactive, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import DataTableSkeleton from "@/components/DataTableSkeleton.vue";
import { useMeetStore } from "@/stores/meet.js";
import { useCourseStore } from "@/stores/course.js";
import { useUserStore } from "@/stores/user.js";
import BaseButton from "@/components/BaseButton.vue";
import axiosInstance from "@/utils/axios";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const meetStore = useMeetStore();
const courseStore = useCourseStore();
const userStore = useUserStore();
const { meets } = storeToRefs(meetStore);
const { errors } = storeToRefs(meetStore);

const loadMeets = async (page = 1) => {
  await meetStore.all(page);
}

const joinMeet = async (meet) => {
  if (confirm('Are you sure you went to live?')) {
    const response = await meetStore.join(meet);
    await loadMeets();
    window.open(response.data.host_url, '_blank');
  }
};

const deleteMeet = async (meet) => {
  if (confirm('Are you sure you went deleted this live?')) {
    await meetStore.delete(meet);
  }
  await loadMeets();
}

const courses = ref([]);
const users = ref([]);

const form = reactive({
  topic: '',
  start_date: '',
  start_time: '',
  duration: '',
  course_id: '',
  host_id: '',
  provider: '',
  status: 'scheduled',
});

const submit = async () => {
  await meetStore.store(form);
  await loadMeets();
}

const loadCourses = async () => {
  const response = await courseStore.search('');
  courses.value = response.data;
}

const loadUsers = async () => {
  const response = await userStore.search({
    role: 'instructor',
  });
  users.value = response.data;
}

const loginWithGoogle = async () => {
  const response = await axiosInstance.get('/api/google/auth');
  // Redirect user to Google OAuth
  window.location.href = response.data;
}

const copied = ref(false);

const copyClipboard = async (text) => {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 1500)
}

onMounted(() => {
  loadMeets();
  loadCourses();
  loadUsers();
});

</script>

<template>
  <Default>
    <transition name="fade">
      <div v-if="copied" class="max-w-xs flex items-center gap-3
           bg-white border border-green-200 shadow-lg
           px-4 py-3 rounded-xl">

        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-sm font-medium text-gray-700">
          Link copied successfully
        </span>
      </div>
    </transition>
    <div class="grid grid-cols-3 gap-4">
      <div class="card col-span-2">
        <div class="card__header">
          <h3 class="card__title">Live Classes</h3>
        </div>

        <div class="card__body overflow-x-auto">
          <template v-if="meets.data">
            <table>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="meet in meets.data">
                  <td>{{ meet.topic }}</td>
                  <td>{{ meet.start_time_formatted }}</td>
                  <td>{{ meet.end_time_formatted }}</td>
                  <td>
                    <span v-if="meet.provider === 'zoom'">Zoom</span>
                    <span v-else-if="meet.provider === 'google_meet'">Google Meet</span>
                    <span v-else>Other</span>
                  </td>
                  <td>{{ meet.status }}</td>
                  <td class="text-right">
                    <div class="flex items-center gap-2">
                      <button @click="joinMeet(meet.id)"
                        class="bg-primary cursor-pointer text-white text-xs px-2 py-1 rounded">
                        Go Live
                      </button>
                      <button type="button" @click.prevent="copyClipboard(meet.host_url)"
                        class="bg-blue-500 cursor-pointer text-white text-xs px-2 py-1 rounded">
                        Copy link
                      </button>
                      <button type="button" @click.prevent="deleteMeet(meet.id)"
                        class="bg-red-500 cursor-pointer text-white text-xs px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <Pagination v-if="meets.meta" class="mt-4" :total-items="meets.meta?.total"
              :current-page="meets.meta?.current_page" :items-per-page="meets.meta?.per_page" :pages-to-show="2"
              @page-change="loadMeets" visible-always />

          </template>

          <template v-else>
            <DataTableSkeleton />
          </template>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Create Meeting</h3>
          <button @click="loginWithGoogle" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Login with
            Google</button>
        </div>

        <div class="card__body">
          <form @submit.prevent="submit">
            <div class="form__group">
              <label class="form__label">Topic</label>
              <input type="text" v-model="form.topic" class="form__control"
                placeholder="Enter live class topic (e.g. Class 6 English)" />
              <small v-if="errors.topic" class="text-danger">{{ errors.topic[0] }}</small>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="form__group">
                <label class="form__label">Start Date</label>
                <input type="date" v-model="form.start_date" class="form__control" />
              </div>
              <div class="form__group">
                <label class="form__label">Start Time</label>
                <input type="time" v-model="form.start_time" class="form__control" />
              </div>
            </div>

            <div class="form__group">
              <label class="form__label">Duration</label>
              <select v-model="form.duration" class="form__select w-full">
                <option value="" disabled>Select duration</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="90">1 Hour 30 Minutes</option>
                <option value="120">2 Hours</option>
              </select>
              <small v-if="errors.duration" class="text-danger">
                {{ errors.duration[0] }}
              </small>
            </div>

            <div class="form__group">
              <label class="form__label">Course</label>
              <select v-model="form.course_id" class="form__select w-full">
                <option value="">Select course</option>
                <option :value="course.id" v-for="course in courses" :key="course.id">{{ course.title }}
                </option>
              </select>
              <small v-if="errors.course_id" class="text-danger">{{ errors.course_id[0] }}</small>
            </div>
            <div class="form__group">
              <label class="form__label">Status</label>
              <select v-model="form.host_id" class="form__select w-full">
                <option value="">Select User</option>
                <option :value="user.id" v-for="user in users" :key="user.id">{{ user.name }}</option>
              </select>
              <small v-if="errors.user_id" class="text-danger">{{ errors.user_id[0] }}</small>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="form__group">
                <label class="form__label">Platform</label>
                <select v-model="form.provider" class="form__select w-full">
                  <option value="" disabled="">Select Provider</option>
                  <option value="zoom">Zoom</option>
                  <option value="google_meet">Google Meet</option>
                </select>
              </div>
              <div class="form__group">
                <label class="form__label">Status</label>
                <select v-model="form.status" class="form__select w-full">
                  <option value="scheduled">Scheduled</option>
                  <option value="started">Started</option>
                </select>
              </div>
            </div>
            <div class="form__group">
              <BaseButton :loading="meetStore.loading" class="w-full">Submit</BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>