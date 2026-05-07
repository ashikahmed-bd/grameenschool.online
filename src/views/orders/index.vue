<script setup>
import Default from "@/layouts/Default.vue";
import DataTableSkeleton from "@/components/DataTableSkeleton.vue";
import { useOrderStore } from "@/stores/order.js";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import BaseTable from "@/components/BaseTable.vue";

const orderStore = useOrderStore();
const { orders } = storeToRefs(orderStore);
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
        <RouterLink to="/orders/create" class="card__link">Create</RouterLink>
      </div>

      <div class="card__body">
        <template v-if="orders.data">
          <div class="">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

              <!-- Search -->
              <div class="w-full md:w-1/3">
                <input type="text" placeholder="Search by Invoice ID..." class="form__control w-full" />
              </div>

              <!-- Status Filter -->
              <div class="w-full md:w-1/4">
                <select class="form__control w-full">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

            </div>
            <div class="relative overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Subtotal</th>
                    <th>Discount</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="order in orders.data" :key="order.id">
                    <td>{{ order.invoice_id }}</td>
                    <td>{{ order.subtotal_formatted }}</td>
                    <td>{{ order.discount_formatted }}</td>
                    <td>{{ order.total_formatted }}</td>
                    <td>{{ order.paid_formatted }}</td>
                    <td>{{ order.due_formatted }}</td>
                    <td>{{ order.payment_method }}</td>
                    <td>
                      <span class="badge text-white text-xs" :class="{
                        'bg-warning': order.status === 'pending',
                        'bg-info': order.status === 'partial',
                        'bg-success': order.status === 'paid',
                        'bg-danger': order.status === 'failed',
                        'bg-secondary': order.status === 'refunded',
                        'bg-dark': order.status === 'cancelled'
                      }">
                        {{ order.status }}
                      </span>
                    </td>

                    <td class="px-6 py-4 space-x-2">
                      <RouterLink :to="{ name: 'orders.view', params: { id: order.id } }" class="badge badge__info">View
                      </RouterLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <Pagination v-if="orders.data" class="mt-4" :total-items="orders.meta?.total"
            :current-page="orders.meta?.current_page" :items-per-page="orders.meta?.per_page" :pages-to-show="2"
            @page-change="getOrders" visible-always />

        </template>

        <template v-else>
          <DataTableSkeleton />
        </template>

      </div>
    </div>

  </Default>
</template>

<style scoped></style>