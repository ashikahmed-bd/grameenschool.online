<script setup>
import { reactive } from 'vue'
import Default from '@/layouts/Default.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

const form = reactive({
    code: '',
    discount: '',
    commission: '',
    type: 'percent',
    usage_limit: '',
    starts_at: '',
    expires_at: '',
    is_active: true,
})

const submit = () => {
    console.log(form)
    // এখানে API call করবে (axios / useFetch)
}
</script>

<template>
    <Default>
        <div class="card">
            <div class="card__header">
                <h3 class="card__title">Create Coupon</h3>

                <RouterLink :to="{ name: 'coupons' }" class="base__button">
                    All Coupons
                </RouterLink>
            </div>

            <div class="card__body">
                <form @submit.prevent="submit" class="grid grid-cols-2 gap-4">
                    <BaseInput v-model="form.code" label="Coupon Code" placeholder="e.g. WELCOME10" />
                    <BaseInput v-model="form.discount" label="Discount" type="number" placeholder="10" />
                    <BaseInput v-model="form.commission" type="number" label="Commission" placeholder="20" />

                    <BaseSelect label="Type" v-model="form.type" :options="[
                        { name: 'Percent', id: 'percent' },
                        { name: 'Fixed', id: 'fixed' }
                    ]" placeholder="Select type" />

                    <BaseInput v-model="form.usage_limit" type="number" label="Usage Limit" placeholder="100" />

                    <BaseInput v-model="form.starts_at" type="datetime-local" label="Start Date" />

                    <BaseInput v-model="form.expires_at" type="datetime-local" label="Expiry Date" />

                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="form.is_active" />
                        <label>Active</label>
                    </div>

                    <!-- Submit -->
                    <div class="pt-3">
                        <button type="submit" class="base__button">
                            Create Coupon
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </Default>
</template>