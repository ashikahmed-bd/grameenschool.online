<script setup>
import Default from '@/layouts/Default.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import debounce from 'lodash.debounce'
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';
import BaseButton from '@/components/BaseButton.vue';
import { useCourseStore } from '@/stores/course';

const userStore = useUserStore();
const courseStore = useCourseStore();
const orderStore = useOrderStore();
const { users } = storeToRefs(userStore);
const { courses } = storeToRefs(courseStore);
const showUsers = ref(false)

const selectedUser = ref(null)
const selectedCourse = ref(null)

const form = reactive({
    user_id: '',
    course_id: '',
    discount: ''
})

const search = reactive({
    user: '',
    course: '',
});


const searchUsers = debounce(async () => {
    if (!search.user.trim()) {
        return
    }

    try {
        await userStore.search({
            query: search.user
        })
    } catch (error) {
        console.log(error)
    }
}, 500)


const selectUser = (user) => {
    form.user_id = user.id
    search.user = user.phone

    selectedUser.value = user;
    showUsers.value = false
}

watch(
    () => form.course_id,
    (id) => {
        selectedCourse.value = courses.value?.data?.find(
            course => course.id === id
        ) || null
    }
)


const loadCourses = async () => {
    await courseStore.search('')
}

const submit = async () => {
    console.log(form)
}

onMounted(() => {
    loadCourses();
})
</script>

<template>
    <Default>
        <div class="card">
            <div class="card__header">
                <h3 class="card__title">Order create</h3>
                <RouterLink to="/orders" class="card__link">Order List</RouterLink>
            </div>

            <div class="card__body">
                <div class="grid grid-cols-2 gap-6">
                    <form class="form" @submit.prevent="submit">
                        <div class="form__group">
                            <label class="form__label">
                                User Search
                            </label>

                            <div class="relative">
                                <input v-model="search.user" type="search" class="form__control"
                                    placeholder="Search user by phone or email" @input="searchUsers"
                                    @focus="showUsers = true">

                                <div v-if="showUsers && users.data?.length"
                                    class="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl z-30 overflow-y-auto max-h-60">
                                    <div v-for="user in users.data" :key="user.id" @click="selectUser(user)"
                                        class=" flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0">
                                        <div
                                            class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm uppercase">
                                            {{ user.name?.charAt(0) }}
                                        </div>

                                        <div class="flex-1 min-w-0">
                                            <h4 class="text-sm font-semibold text-gray-800 truncate">
                                                {{ user.name }}
                                            </h4>

                                            <div class="flex items-center gap-2 mt-1">
                                                <p class="text-xs text-gray-500">
                                                    {{ user.phone }}
                                                </p>
                                            </div>
                                        </div>

                                        <div @click="selectUser(user)" class="text-xs text-primary font-medium">
                                            Select
                                        </div>
                                    </div>

                                    <div v-if="!users.data.length" class="px-4 py-6 text-center text-sm text-gray-500">
                                        No users found
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form__group">
                            <label class="form__label">
                                Course ID
                            </label>

                            <select v-model="form.course_id" class="form__select w-full">
                                <option value="" disabled selected>
                                    Select course
                                </option>

                                <option v-for="course in courses.data" :key="course.id" :value="course.id">
                                    {{ course.title }}
                                </option>
                            </select>
                        </div>

                        <div class="form__group">
                            <label class="form__label">
                                Discount
                            </label>

                            <input v-model="form.discount" type="number" class="form__control"
                                placeholder="Enter discount amount">
                        </div>

                        <BaseButton :loading="orderStore.loading">Submit</BaseButton>

                    </form>

                    <div v-if="selectedUser" class="block p-4 bg-white border border-border rounded-xl">
                        <div class="flex items-center gap-3">
                            <img :src="selectedUser.avatar_url" class="w-12 h-12 rounded-full object-cover" />

                            <div class="flex-1">
                                <h3 class="text-sm font-semibold text-gray-800">
                                    {{ selectedUser.name }}
                                </h3>

                                <p class="text-xs text-gray-500">
                                    {{ selectedUser.phone }}
                                </p>
                            </div>

                            <span class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                                {{ selectedUser.role }}
                            </span>
                        </div>


                        <div v-if="selectedCourse" class="mt-4 pt-4 border-t border-border">
                            <h4 class="text-sm font-semibold text-gray-700">
                                Selected Course
                            </h4>

                            <div class="mt-2 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <h3 class="text-sm font-medium text-gray-800">
                                    {{ selectedCourse.title }}
                                </h3>

                                <span class="text-sm font-semibold text-primary">
                                    {{
                                        selectedCourse?.price
                                            ? selectedCourse?.price_formatted
                                            : selectedCourse?.base_price_formatted
                                    }}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </Default>

</template>
