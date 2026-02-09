<script setup>
import Default from "@/layouts/Default.vue";
import {usePayoutStore} from "@/stores/payout.js";
import {ref, onMounted, watch} from "vue";
import {storeToRefs} from "pinia";
import DataTableSkeleton from "@/components/DataTableSkeleton.vue";
import IconSearch from "@/components/icons/IconSearch.vue";

const payoutStore = usePayoutStore();
const {payouts} = storeToRefs(payoutStore);

const status = ref('');
const search = ref('');

const getPayouts = async (page = 1) => {
  await payoutStore.all(search.value, status.value, page);
}

onMounted(() => {
  getPayouts();
});

watch(search, (val) => {
  if (val === '') {
    getPayouts();
  }
});
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Payouts List</h3>
      </div>

      <div class="card__body">
        <div class="flex items-center justify-between mb-4">
          <label class="relative">
            <input type="search" v-model="search" class="px-4 pr-10 py-1.5 rounded border border-primary focus:outline-none outline-none" placeholder="Enter search"/>
            <button type="button" @click="getPayouts" class="cursor-pointer absolute right-0 px-2 h-full rounded-r bg-primary text-white">
              <IconSearch class="size-5"/>
            </button>
          </label>

          <select v-model="status" @change="getPayouts()" class="form__select">
            <option value="">Payment Status</option>
            <option value="created">Created</option>
            <option value="initiated">Initiated</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

        </div>

        <template v-if="payouts.data">
          <table>
            <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Fee</th>
              <th>Net Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="payout in payouts.data">
              <td>
                <div class="flex items-center">
                  <img :src="payout.user?.avatar_url" :alt="payout.user?.name" class="w-10 h-10 rounded-full object-cover" />
                  <div class="ml-2">
                    <h6 class="font-semibold">{{payout.user?.name}}</h6>
                    <p class="font-normal text-sm">{{payout.user?.phone}}</p>
                  </div>
                </div>
              </td>
              <td>{{payout.user?.email ?? 'N/A'}}</td>
              <td>{{payout.amount_formatted}}</td>
              <td>{{payout.fee_formatted}}</td>
              <td>{{payout.net_amount_formatted}}</td>
              <td>
                <span class="badge badge__primary capitalize">{{payout.method}}</span>
              </td>
              <td>
                <span class="badge badge__success capitalize">{{payout.status}}</span>
              </td>
              <td class="space-x-2">
                <RouterLink :to="{name: 'payouts.update', params: {id: payout.id}}" class="badge badge__info">
                  View
                </RouterLink>
              </td>
            </tr>

            </tbody>
          </table>

          <Pagination
              class="mt-4"
              :total-items="payouts.meta.total"
              :current-page="payouts.meta.current_page"
              :items-per-page="payouts.meta.per_page"
              :pages-to-show="2"
              @page-change="getPayouts"
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