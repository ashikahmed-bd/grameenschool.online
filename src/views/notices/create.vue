<script setup>
import Default from "@/layouts/Default.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useNoticeStore } from "@/stores/notice.js";
import { reactive } from "vue";

const noticeStore = useNoticeStore();

const form = reactive({
  title: '',
  body: '',
  type: '',
  target: '',
  published: true,
});

const submit = async () => {
  await noticeStore.store(form);
}

</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Add Notice</h3>
        <RouterLink :to="{ name: 'notices' }" class="base__button">
          All Notices
        </RouterLink>
      </div>

      <div class="card__body">
        <form @submit.prevent="submit">
          <div class="max-w-xl">
            <div class="form__group">
              <label class="form__label">Notice Title</label>
              <input type="text" v-model="form.title" class="form__control" placeholder="Notice Title" />
            </div>

            <div class="form__group">
              <label class="form__label">Description</label>
              <textarea class="form__control" v-model="form.body" placeholder="Notice description"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="form__group">
                <label class="form__label">Type</label>
                <select v-model="form.type" class="form__select w-full">
                  <option value="" disabled>Notice Type</option>
                  <option value="notice">Notice</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              <div class="form__group">
                <label class="form__label">Target</label>
                <select v-model="form.target" class="form__select w-full">
                  <option value="" disabled>Notice Target</option>
                  <option value="admin">Admin</option>
                  <option value="author">Author</option>
                  <option value="instructor">Instructor</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>

            <div class="form__group">
              <label class="form__label">Published</label>
              <select v-model="form.published" class="form__select w-full">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div class="form__group">
              <BaseButton :loading="noticeStore.loading">Submit</BaseButton>
            </div>

          </div>
        </form>

      </div>
    </div>

  </Default>
</template>

<style scoped></style>