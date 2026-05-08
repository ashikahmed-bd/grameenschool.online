<script setup>
import Default from "@/layouts/Default.vue";
import { useOrderStore } from "@/stores/order.js";
import { onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import BaseInput from "@/components/BaseInput.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import { usePaymentStore } from "@/stores/payment";

const route = useRoute();
const orderStore = useOrderStore();
const paymentStore = usePaymentStore();

const { order } = storeToRefs(orderStore);

const loadOrder = async () => {
    await orderStore.show(route.params.id);
}

const payment = reactive({
    amount: "",
    method: "",
});

const submitPayment = async () => {
    await paymentStore.collect(route.params.id, payment);
    await loadOrder();

    payment.amount = null;
    payment.method = null;
};

onMounted(() => {
    loadOrder();
})

</script>

<template>
    <Default>
        <main class="space-y-6">
            <section class="rounded-2xl bg-white">
                <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div class="space-y-3">
                        <div
                            class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                            <span class="h-2 w-2 rounded-full bg-green-500"></span>
                            Invoice Summary
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold lg:text-4xl text-slate-900">
                                {{ order.invoice_id }}
                            </h1>

                            <p class="mt-2 text-sm text-slate-500">
                                Created at:
                                {{
                                    new Date(order.created_at).toLocaleString("en-BD", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })
                                }}
                            </p>
                        </div>
                    </div>


                    <div class="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 min-w-xs">
                        <div>
                            <p class="text-xs text-slate-500">Total</p>
                            <h2 class="mt-1 text-xl font-bold text-slate-900">
                                {{ order.total_formatted }}
                            </h2>
                        </div>

                        <div>
                            <p class="text-xs text-slate-500">Paid</p>
                            <h2 class="mt-1 text-xl font-bold text-green-600">
                                {{ order.paid_formatted }}
                            </h2>
                        </div>

                        <div>
                            <p class="text-xs text-slate-500">Due</p>
                            <h2 class="mt-1 text-xl font-bold text-orange-500">
                                {{ order.due_formatted }}
                            </h2>
                        </div>

                        <div>
                            <p class="text-xs text-slate-500">Status</p>
                            <span
                                class="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 capitalize">
                                {{ order.status }}
                            </span>
                        </div>
                    </div>
                </div>
            </section>


            <section class="grid gap-6 lg:grid-cols-3">
                <div class="rounded-2xl bg-white p-6">
                    <div class="flex items-center gap-4">
                        <img :src="order.user?.avatar_url" alt="avatar" class="h-14 w-14 rounded-xl object-cover" />
                        <div>
                            <h3 class="text-lg font-semibold text-slate-900">
                                {{ order.user?.name }}
                            </h3>
                            <p class="text-sm text-slate-500">
                                {{ order.user?.phone }}
                            </p>
                        </div>
                    </div>

                    <div class="py-4">
                        <form @submit.prevent="submitPayment" class="space-y-4">
                            <BaseInput label="Amout" v-model="payment.amount" placeholder="Enter amout" />

                            <BaseSelect label="Method" v-model="payment.method" :options="[
                                { name: 'Bkash', id: 'bkash' },
                                { name: 'Nagad', id: 'nagad' },
                                { name: 'Rocket', id: 'rocket' },
                                { name: 'Upay', id: 'upay' },
                                { name: 'Cash', id: 'cash' },
                                { name: 'Card', id: 'card' },
                            ]" placeholder="Select method" />

                            <BaseButton :loading="paymentStore.loading" class="w-full">Collect Payment</BaseButton>
                        </form>
                    </div>
                </div>

                <div class="rounded-2xl bg-white p-6 lg:col-span-2">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-bold text-slate-900">
                            Payment Overview
                        </h2>
                        <span class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 capitalize">
                            {{ order.status }}
                        </span>
                    </div>

                    <div class="mt-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-500">Subtotal</span>
                            <span class="font-semibold text-slate-900">
                                {{ order.subtotal_formatted }}
                            </span>
                        </div>

                        <div class="flex items-center justify-between">
                            <span class="text-slate-500">Discount</span>
                            <span class="font-semibold text-red-500">
                                - {{ order.discount_formatted }}
                            </span>
                        </div>

                        <div class="flex items-center justify-between">
                            <span class="text-slate-500">Paid Amount</span>
                            <span class="font-semibold text-green-600">
                                {{ order.paid_formatted }}
                            </span>
                        </div>

                        <div class="border-t border-border pt-4 flex items-center justify-between">
                            <span class="text-lg font-bold text-slate-900">
                                Due Amount
                            </span>

                            <span class="text-xl font-extrabold text-orange-500">
                                {{ order.due_formatted }}
                            </span>
                        </div>

                        <div class="pt-2">
                            <div class="mb-2 flex items-center justify-between text-sm">
                                <span class="text-slate-500">Payment Progress</span>
                                <span class="font-semibold text-slate-700">
                                    {{
                                        Math.round((order.paid / order.total) * 100)
                                    }}%
                                </span>
                            </div>

                            <div class="h-2 overflow-hidden rounded-full bg-slate-200">
                                <div class="h-full bg-primary" :style="{
                                    width: (order.paid / order.total) * 100 + '%'
                                }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section class="rounded-2xl bg-white p-6">
                <div class="mb-6 border-b border-border pb-4">
                    <h2 class="text-lg font-bold text-slate-900">
                        Payment History
                    </h2>
                    <p class="text-sm text-slate-500">
                        Recent transactions and payment logs
                    </p>
                </div>

                <div class="space-y-4">
                    <div v-for="payment in order.payments" :key="payment.id"
                        class="flex flex-col gap-3 rounded-xl border border-border p-4 hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between">
                        <div class="flex items-center gap-4">

                            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div>
                                <h3 class="font-semibold text-slate-900 capitalize">
                                    {{ payment.method }}
                                </h3>

                                <p class="text-sm text-slate-500">
                                    {{ payment.transaction_id }}
                                </p>

                                <p class="text-xs text-slate-400">
                                    {{ payment.paid_at }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                            <span class="text-lg font-bold text-slate-900">
                                {{ payment.amount_formatted }}
                            </span>
                            <span
                                class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 capitalize">
                                {{ payment.status }}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </Default>
</template>

<style scoped></style>