<script setup>
import Default from "@/layouts/Default.vue";
import BaseButton from "@/components/BaseButton.vue";
import {usePayoutStore} from "@/stores/payout.js";
import {storeToRefs} from "pinia";
import {reactive, onMounted} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const payoutStore = usePayoutStore();
const {payout} = storeToRefs(payoutStore);

const form = reactive({
  status: '',
  paid_at: '',
  trx_id: ''
});

const submit = async () => {
  await payoutStore.update(route.params.id, form);
}

const loadPayout = async () => {
  await payoutStore.show(route.params.id);
}

onMounted(() => {
  loadPayout();
});
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Update Payout</h3>
        <RouterLink :to="{name: 'payouts'}" class="base__button" >
          All Payouts
        </RouterLink>
      </div>

      <div class="card__body">
        <div class="grid grid-cols-3 gap-4">
          <div class="w-full col-span-2">
            <form @submit.prevent="submit" class="grid grid-cols-2 gap-4">
              <div class="form__group">
                <label class="form__label">Amount</label>
                <input type="text" v-model="payout.amount" class="form__control" disabled/>
              </div>

              <div class="form__group">
                <label class="form__label">Fee</label>
                <input type="text" v-model="payout.fee" class="form__control" disabled/>
              </div>

              <div class="form__group">
                <label class="form__label">Net Amount</label>
                <input type="text" v-model="payout.net_amount" class="form__control" disabled/>
              </div>

              <div class="form__group">
                <label class="form__label">Payment Method</label>
                <input type="text" v-model="payout.method" class="form__control" disabled/>
              </div>

              <div class="form__group">
                <label class="form__label">Account</label>
                <input type="text" v-model="payout.account" class="form__control" disabled/>
              </div>

              <div class="form__group">
                <label class="form__label">Status</label>
                <select v-model="form.status" class="form__control w-full">
                  <option value="">Select Status</option>
                  <option value="paid">Paid</option>
                  <option value="failed">failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div class="form__group">
                <label class="form__label">Paid Date</label>
                <input type="date" v-model="form.paid_at" class="form__control"/>
              </div>

              <div class="form__group">
                <label class="form__label">TRX ID</label>
                <input type="text" v-model="form.trx_id" class="form__control" placeholder="Enter trx id"/>
              </div>

              <div class="form__group">
                <BaseButton :loading="payoutStore.loading">Submit</BaseButton>
              </div>
            </form>
          </div>

          <div class="flex items-start justify-center">
            <div class="items-center">
              <img :src="payout.user?.avatar_url" :alt="payout.user?.name" class="h-32 w-32 rounded-full">
              <div class="text-center py-4">
                <h3 class="text-base font-semibold">{{payout.user?.name}}</h3>
                <small class="text-sm">{{payout.user?.title}}</small>
                <p class="text-sm">{{payout.user?.phone}}</p>
                <p class="text-sm">{{payout.user?.email ?? 'N/A'}}</p>

                <div class="py-4">
                  <p class="bg-primary text-white px-2 py-0.5 rounded-full text-sm">Balance: {{payout.user?.balance_formatted}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </Default>
</template>

<style scoped>

</style>