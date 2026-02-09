<script setup>
import Default from "@/layouts/Default.vue";
import {useReviewStore} from "@/stores/review.js";
import {onMounted} from 'vue';
import {storeToRefs} from "pinia";
import DataTableSkeleton from "@/components/DataTableSkeleton.vue";


const reviewStore = useReviewStore();
const {reviews} = storeToRefs(reviewStore);

const getReviews = async (page = 1) => {
  await reviewStore.all(page);
}

onMounted(() => {
  getReviews();
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Reviews</h3>
      </div>

      <div class="card__body">
        <template v-if="reviews.data">
          <div class="w-full max-w-5xl mx-auto">
            <article v-for="review in reviews.data" class="flex items-start border-b border-gray-200 pb-4 mb-4">
              <div class="me-4">
                <img :src="review.user?.avatar_url" :alt="review.user?.name" class="w-12 h-12 rounded-full object-cover" />
              </div>

              <div class="flex-1">
                <div class="flex justify-between items-baseline flex-wrap pb-1">
                  <h5 class="text-lg font-semibold text-gray-800">{{review.course?.title}}</h5>
                </div>

                <div class="flex items-center flex-wrap text-sm text-gray-600 pb-1">
                  <div class="flex text-yellow-400">
                    <span class="la la-star"></span>
                    <span class="la la-star"></span>
                    <span class="la la-star"></span>
                    <span class="la la-star"></span>
                    <span class="la la-star"></span>
                  </div>
                  <div class="pl-2">by <a href="#" class="text-blue-600 hover:underline mx-1">
                    {{review.user?.name}}</a>· {{review.created_at?.human}}
                  </div>
                </div>

                <div v-html="review.review" class="text-gray-700 pb-3"></div>

                <a href="#" class="inline-flex items-center text-blue-600 hover:underline text-sm font-medium">
                  <i class="la la-reply mr-1"></i> Reply to this review
                </a>
              </div>
            </article>

            <Pagination
                class="mt-4"
                :total-items="reviews.meta?.total"
                :current-page="reviews.meta?.current_page"
                :items-per-page="reviews.meta?.per_page"
                :pages-to-show="2"
                @page-change="getReviews"
                visible-always
            />
          </div>
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