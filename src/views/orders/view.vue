<script setup>
import Default from "@/layouts/Default.vue";
import { useOrderStore } from "@/stores/order.js";
import { usePaymentStore } from "@/stores/payment";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const route = useRoute();
const orderStore = useOrderStore();
const paymentStore = usePaymentStore();
const { order } = storeToRefs(orderStore);

const loadOrder = async () => {
    await orderStore.show(route.params.id);
}

const approvedPayment = async (invoice_id) => {

    if (confirm('Are you you went to approved this payment?')) {
        await paymentStore.approved(invoice_id);
    }
    await loadOrder();

}


onMounted(() => {
    loadOrder();
})

</script>

<template>
    <Default>
        <div class="p-4 bg-white rounded-xl">
            <template v-if="order">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-semibold">Order ID: #{{ order.invoice_id }}</h2>
                        <p class="text-sm text-gray-500">Created time: {{ order.created_at }}</p>
                    </div>
                    <div class="flex items-center flex-wrap gap-2 text-sm">
                        <!-- Status Badge -->
                        <span v-if="order.status" :class="[
                            'inline-block px-2 py-1 rounded-full text-white text-xs font-semibold capitalize',
                            {
                                'bg-yellow-500': order.status === 'pending',
                                'bg-blue-500': order.status === 'paid',
                                'bg-green-600': order.status === 'completed',
                                'bg-red-500': ['failed', 'cancelled', 'refunded'].includes(order.status),
                            },
                        ]">
                            {{ order.status }}
                        </span>

                        <button v-if="['pending', 'paid'].includes(order.status)" type="button"
                            @click="approvedPayment(order.invoice_id)"
                            class="bg-primary hover:bg-primary-dark text-white text-xs px-3 py-1 rounded-md transition-all">
                            Approve
                        </button>
                    </div>

                </div>

                <div class="flex items-start gap-4">
                    <div class="flex-grow">
                        <!-- Order Items -->
                        <div class="mb-6 border border-border rounded-lg p-4">
                            <h3 class="text-lg font-medium mb-4">Order Items</h3>
                            <div class="space-y-4">
                                <article v-for="item in order.items" class="flex justify-between items-center">
                                    <div class="flex items-start gap-4">
                                        <img :src="item.course?.cover_url" :alt="item.course?.title"
                                            class="h-20 w-auto">
                                        <div class="flex-grow">
                                            <h3 class="text-base font-semibold">{{ item.course?.title }}</h3>
                                            <p>Quantity: {{ item.quantity }}</p>
                                            <p>{{ item.price_formatted }}</p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>

                        <!-- Order Summary -->
                        <div class="mb-6 border border-border rounded-lg p-4">
                            <h3 class="text-lg font-medium mb-4">Order Summary</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{{ order.subtotal_formatted }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Discount:</span>
                                    <span>–{{ order.discount_formatted }}</span>
                                </div>
                                <div class="flex justify-between font-semibold text-base">
                                    <span>Total:</span>
                                    <span>{{ order.total_formatted }}</span>
                                </div>
                            </div>

                            <div class="mt-4 flex space-x-2">
                                <button class="base__button">Send invoice</button>
                            </div>
                        </div>
                    </div>

                    <div v-if="order.user" class="flex-none w-72 space-y-4">
                        <div class="border border-border rounded-lg p-4">
                            <h3 class="font-semibold mb-2">Student Info</h3>
                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Name:</span>
                                    <span class="text-sm">{{ order.user?.name }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Title:</span>
                                    <span class="text-sm">{{ order.user?.title ?? 'N/A' }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Email:</span>
                                    <span class="text-sm">{{ order.user?.email ?? 'N/A' }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Phone:</span>
                                    <span class="text-sm">{{ order.user?.phone }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="order.payment" class="border border-border rounded-lg p-4">
                            <div class="flex items-center justify-between py-4">
                                <h3 class="font-semibold mb-2">Payment Info</h3>
                                <span class="bg-success text-white px-2 rounded-full text-sm capitalize">{{
                                    order.payment?.status
                                }}</span>
                            </div>

                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Order ID</span>
                                    <span class="text-sm">{{ order.payment?.invoice_id }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Method</span>
                                    <span class="text-sm">{{ order.payment?.method }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Amount</span>
                                    <span class="text-sm">{{ order.payment?.amount_formatted }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Discount</span>
                                    <span class="text-sm">{{ order.payment?.discount_formatted }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Payable</span>
                                    <span class="text-sm">{{ order.payment?.total_formatted }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Paid Date</span>
                                    <span class="text-sm">{{ order.payment?.paid_at }}</span>
                                </div>


                            </div>
                        </div>

                        <div v-if="order.referral" class="border border-border rounded-lg p-4">
                            <h3 class="font-semibold mb-2">Referral Info</h3>
                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Referral Code</span>
                                    <span class="text-sm">{{ order.referral?.code }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Commission</span>
                                    <span class="text-sm">{{ order.referral?.commission }}%</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Discount</span>
                                    <span class="text-sm">{{ order.referral?.discount }}%</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Used Count</span>
                                    <span class="text-sm">{{ order.referral?.used_count }}</span>
                                </div>

                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Total Clicks</span>
                                    <span class="text-sm">{{ order.referral?.clicks }}</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Status</span>
                                    <span v-if="order.referral?.status"
                                        class="bg-success text-white px-2 py-0.5 rounded-full text-sm">Active</span>
                                    <span v-else class="bg-danger text-white px-2 py-0.5 rounded-full text-sm">{{
                                        order.referral?.status
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </template>

            <template v-else>
                <p>loading...</p>
            </template>
        </div>

    </Default>
</template>

<style scoped></style>