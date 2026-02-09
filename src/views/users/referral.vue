<script setup>
import Default from '@/layouts/Default.vue'
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useReferralStore } from '@/stores/referral'
import BaseSelect from '@/components/BaseSelect.vue'

const referralStore = useReferralStore()

const route = useRoute()
const errors = ref([])

const form = reactive({
  user_id: route.params.id,
  code: '',
  commission: '',
  discount: '',
  status: '',
})

const submit = () => {
  referralStore.store(form)
}
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Referral Apply</h3>
      </div>

      <div class="card__body max-w-3xl">
        <form @submit.prevent="submit">
          <BaseInput
            label="Code"
            v-model="form.code"
            :error="errors.code"
            placeholder="Enter code"
            required
          />

          <BaseInput
            label="Commission"
            type="number"
            v-model="form.commission"
            :error="errors.commission"
            placeholder="Enter commission"
            required
          />

          <BaseInput
            label="Discount"
            type="number"
            v-model="form.discount"
            :error="errors.discount"
            placeholder="Enter discount"
            required
          />

          <BaseSelect
            label="Status"
            v-model="form.status"
            :options="[
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
            ]"
          />

          <BaseButton :loading="referralStore.loading">Apply</BaseButton>
        </form>
      </div>
    </div>
  </Default>
</template>
