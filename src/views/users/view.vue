<script setup>
import Default from '@/layouts/Default.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import IconMail from '@/components/icons/IconMail.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import BaseTable from '@/components/BaseTable.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const user = ref(null)

const loadUser = async () => {
  const response = await userStore.show(route.params.id)
  user.value = response.data
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <Default>
    <div class="card">
      <div class="card__header">
        <h3 class="card__title">Users Details</h3>
      </div>

      <div class="card__body">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-gray-100 flex items-start gap-4 p-4 rounded-xl">
              <div class="w-full">
                <!-- Header -->
                <div class="flex items-center gap-4 mb-4">
                  <div class="size-12 rounded-full flex items-center justify-center">
                    <img :src="user.avatar_url" :alt="user.name" class="size-12 rounded-full" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-800">
                      {{ user.name }}
                    </h2>
                    <small class="bg-primary/10 text-primary px-2 rounded-full font-semibold py-1"
                      >Balance: {{ user.balance_formatted }}</small
                    >
                  </div>
                </div>

                <template v-if="user.instructor">
                  <div class="grid grid-cols-4 gap-2 divide">
                    <div>
                      <span class="font-medium text-gray-800">University:</span>
                      <p class="text-sm">{{ user.instructor?.university }}</p>
                    </div>
                    <div>
                      <span class="font-medium text-gray-800">Qualification:</span>
                      <p class="text-sm">{{ user.instructor?.qualification }}</p>
                    </div>
                    <div>
                      <span class="font-medium text-gray-800">Experience:</span>
                      <p class="text-sm">{{ user.instructor?.experience }}</p>
                    </div>
                    <div>
                      <span class="font-medium text-gray-800">Specialization:</span>
                      <p class="text-sm">{{ user.instructor?.specialization }}</p>
                    </div>
                  </div>
                  <div class="my-4">
                    <span class="font-medium text-gray-800">About:</span>
                    <div
                      v-html="user.instructor?.bio"
                      class="text-gray-600 text-sm mt-1 line-clamp-4"
                    ></div>
                  </div>
                </template>

                <template v-if="user.student">
                  <div class="grid grid-cols-3 gap-2">
                    <div>
                      <span class="font-medium text-gray-800">University:</span>
                      <p class="text-sm">{{ user.student?.university }}</p>
                    </div>
                    <div>
                      <span class="font-medium text-gray-800">Department:</span>
                      <p class="text-sm">{{ user.student?.department }}</p>
                    </div>
                    <div>
                      <span class="font-medium text-gray-800">Session:</span>
                      <p class="text-sm">{{ user.student?.session }}</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <div v-if="user.commissions" class="bg-white rounded-md border border-border p-4">
              <h5 class="text-lg font-semibold mb-3 border-b border-border">Commissions Logs</h5>
              <table>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Source</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in user.commissions">
                    <td>{{ item.amount_formatted }}</td>
                    <td>{{ item.source }}</td>
                    <td>{{ item.note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="space-y-4">
            <div class="bg-white rounded-xl border border-border p-6">
              <h5 class="text-lg font-semibold mb-4 border-b border-border">Contact Details</h5>
              <div class="space-y-4">
                <div class="flex items-center">
                  <IconMessage class="size-10 bg-gray-100 rounded-full p-2.5" />
                  <div class="ml-2">
                    <h6 class="font-semibold text-base text-gray-800 mb-0">Phone</h6>
                    <p class="text-gray-700 text-sm mb-0">{{ user.phone ?? 'N/A' }}</p>
                  </div>
                </div>

                <div class="flex items-center">
                  <IconMail class="size-10 bg-gray-100 rounded-full p-2.5" />
                  <div class="ml-2">
                    <h6 class="font-semibold text-base mb-0">Email</h6>
                    <p class="text-gray-700 text-sm mb-0">{{ user.email ?? 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-border p-6">
              <h5 class="text-lg font-semibold border-b border-border mb-4">Referral Info</h5>
              <template v-if="user.referral">
                <div class="flex items-center justify-between mb-4">
                  <h6 class="font-semibold text-base mb-0">Referral Code</h6>
                  <p class="text-gray-700 text-sm mb-0">{{ user.referral?.code ?? 'N/A' }}</p>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <h6 class="font-semibold text-base mb-0">Commission</h6>
                  <p class="text-gray-700 text-sm mb-0">
                    {{ user.referral?.commission ?? 'N/A' }}
                  </p>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <h6 class="font-semibold text-base mb-0">Discount</h6>
                  <p class="text-gray-700 text-sm mb-0">
                    {{ user.referral?.discount ?? 'N/A' }}
                  </p>
                </div>

                <div class="flex items-center justify-between mb-4">
                  <h6 class="font-semibold text-base mb-0">Total Used</h6>
                  <p class="text-gray-700 text-sm mb-0">
                    {{ user.referral?.used_count ?? 'N/A' }}
                  </p>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <h6 class="font-semibold text-base mb-0">Total Clicks</h6>
                  <p class="text-gray-700 text-sm mb-0">
                    {{ user.referral?.clicks ?? 'N/A' }}
                  </p>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <h6 class="font-semibold text-base mb-0">Total Earnings</h6>
                  <p class="text-gray-700 text-sm mb-0">
                    {{ user.referral?.used_count ?? 'N/A' }}
                  </p>
                </div>
              </template>

              <template>
                <p>No Referral code exits</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped></style>
