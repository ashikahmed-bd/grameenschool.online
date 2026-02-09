<script setup>
import Default from "@/layouts/Default.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useNoticeStore} from "@/stores/notice.js";
import IconMegaPhone from "@/components/icons/IconMegaPhone.vue";
import IconNotice from "@/components/icons/IconNotice.vue";
import DataTableSkeleton from "@/components/DataTableSkeleton.vue";

const noticeStore = useNoticeStore();
const {notices} = storeToRefs(noticeStore);
const getNotices = async (page = 1) => {
  await noticeStore.all(page);
}


onMounted(() => {
  getNotices();
});

</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">All Notices</h3>
        <RouterLink :to="{name: 'notices.create'}" class="base__button" >
          Create
        </RouterLink>
      </div>

      <div class="card__body">
        <template v-if="notices.data">
          <table>
            <thead >
            <tr>
              <th>Type</th>
              <th>Created</th>
              <th>Title</th>
              <th>Target</th>
              <th>Body</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="notice in notices.data">
              <td class="px-4">
                <IconNotice v-if="notice.type === 'notice'" class="size-8 bg-danger text-white p-2 rounded-full"/>
                <IconMegaPhone v-else class="size-8 bg-info text-white p-2 rounded-full"/>
              </td>
              <td>{{notice.created_at?.human}}</td>
              <td>{{notice.title}}</td>
              <td>
                <span v-if="notice.target === 'student'" class="bg-primary text-white text-xs px-2 py-0.5 rounded-full">Student</span>
                <span v-if="notice.target === 'agent'" class="bg-success text-white text-xs px-2 py-0.5 rounded-full">Agent</span>
                <span v-if="notice.target === 'instructor'" class="bg-info text-white text-xs px-2 py-0.5 rounded-full">Instructor</span>
              </td>
              <td class="max-w-xs">
                <span class="block truncate">{{ notice.body }}</span>
              </td>
            </tr>
            </tbody>
          </table>

          <Pagination
              class="mt-4"
              :total-items="notices.meta?.total"
              :current-page="notices.meta?.current_page"
              :items-per-page="notices.meta?.per_page"
              :pages-to-show="2"
              @page-change="getNotices"
              visible-always
          />

        </template>

        <template v-else>
          <DataTableSkeleton/>
        </template>
      </div>
    </div>

  </Default>
</template>

<style scoped>

</style>