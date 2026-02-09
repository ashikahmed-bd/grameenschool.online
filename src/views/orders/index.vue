<script setup>
import Default from "@/layouts/Default.vue";
import DataTableSkeleton from "@/components/DataTableSkeleton.vue";
import {useOrderStore} from "@/stores/order.js";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import BaseTable from "@/components/BaseTable.vue";

const orderStore = useOrderStore();
const {orders} = storeToRefs(orderStore);
const getOrders = async (page = 1) => {
  await orderStore.all(page);
}

onMounted(() => {
  getOrders();
})

</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Order List</h3>
      </div>

      <div class="card__body">
        <template v-if="orders.data">
          <BaseTable>
            <thead>
            <tr>
              <th>Order ID</th>
              <th>Subtotal</th>
              <th>Discount</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="order in orders.data" :key="order.id">
              <td>{{order.invoice_id}}</td>
              <td>{{order.subtotal_formatted}}</td>
              <td>{{order.discount_formatted}}</td>
              <td>{{order.total_formatted}}</td>
              <td>
                <span v-if="order.status === 'pending'" class="badge bg-warning text-white text-xs">{{order.status}}</span>
                <span v-if="order.status === 'paid'" class="badge bg-success text-white text-xs">{{order.status}}</span>
                <span v-if="order.status === 'failed'" class="badge bg-danger text-white text-xs">{{order.status}}</span>
                <span v-if="order.status === 'cancelled'" class="badge bg-danger text-white text-xs">{{order.status}}</span>
                <span v-if="order.status === 'refunded'" class="badge bg-danger text-white text-xs">{{order.status}}</span>
              </td>
              <td>{{order.created_at}}</td>
              <td class="px-6 py-4 space-x-2">
                <RouterLink :to="{name: 'orders.view', params: {id: order.id}}" class="badge badge__info">View</RouterLink>
              </td>
            </tr>

            </tbody>
          </BaseTable>

          <Pagination
              v-if="orders.data"
              class="mt-4"
              :total-items="orders.meta?.total"
              :current-page="orders.meta?.current_page"
              :items-per-page="orders.meta?.per_page"
              :pages-to-show="2"
              @page-change="getOrders"
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