<script setup>
import DataTableSkeleton from '@/components/DataTableSkeleton.vue';
import Default from '@/layouts/Default.vue';
import { useCouponStore } from '@/stores/coupon';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const couponStore = useCouponStore();
const { coupons } = storeToRefs(couponStore);


const getCoupons = async () => {
    await couponStore.all();
}

onMounted(() => {
    getCoupons();
});
</script>

<template>
    <Default>
        <div class="card">
            <div class="card__header">
                <h3 class="card__title">All Coupons</h3>
                <RouterLink :to="{ name: 'coupon.create' }" class="base__button">
                    Create
                </RouterLink>
            </div>

            <div class="card__body">
                <template v-if="coupons.data">
                    <table class="w-full border-collapse">
                        <thead>
                            <tr class="text-left">
                                <th>ID</th>
                                <th class="py-2">Code</th>
                                <th>Type</th>
                                <th>Discount</th>
                                <th>Commission</th>
                                <th>Usage</th>
                                <th>Status</th>
                                <th>Owner</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(coupon, index) in coupons.data" :key="coupon.id">
                                <td>{{ index + 1 }}</td>
                                <td class="py-2 font-medium">{{ coupon.code }}</td>
                                <td><span class="capitalize">{{ coupon.type }}</span></td>
                                <td>{{ coupon.discount }}%</td>
                                <td>{{ coupon.commission }}%</td>
                                <td>
                                    {{ coupon.usage.used }} / {{ coupon.usage.limit }}
                                    <span class="text-xs text-gray-500">
                                        ({{ coupon.usage.remaining }} left)
                                    </span>
                                </td>
                                <td>
                                    <span :class="coupon.is_active ? 'text-green-600' : 'text-red-600'">
                                        {{ coupon.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="text-sm">
                                    <div class="font-medium">
                                        {{ coupon.owner?.name }}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {{ coupon.owner?.phone }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <Pagination class="mt-4" :total-items="coupons.meta?.total"
                        :current-page="coupons.meta?.current_page" :items-per-page="coupons.meta?.per_page"
                        :pages-to-show="2" @page-change="getCoupons" visible-always />

                </template>

                <template v-else>
                    <DataTableSkeleton />
                </template>
            </div>
        </div>

    </Default>
</template>
