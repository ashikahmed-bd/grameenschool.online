<script setup>
import CourseLayout from '@/layouts/CourseLayout.vue'
</script>

<template>
  <CourseLayout>
    <div class="bg-white p-4 rounded-2xl">
      <div class="border-b border-border py-2">
        <h2 class="text-xl font-semibold">Pricing</h2>
      </div>
      <!-- Pricing Section -->
      <div class="w-full py-6">
        <div class="w-full">
          <div class="grid grid-cols-2 gap-4">
            <div class="form__group">
              <label class="form__label">Base Price</label>
              <input type="number" class="form__control" placeholder="Enter base price" />
            </div>

            <div class="form__group">
              <label class="form__label">Price</label>
              <input type="number" class="form__control" placeholder="Enter Price" />
            </div>
          </div>
          <button class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Update</button>
        </div>
      </div>

      <!-- Promotion Coupons Section -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-2">Promotion Coupons</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
          <div class="form__group">
            <label class="form__label">Coupon Code</label>
            <input type="text" class="form__control" placeholder="Enter Coupon Code" />
          </div>

          <div class="form__group">
            <label class="form__label">Quantity</label>
            <input type="text" class="form__control" placeholder="Enter Quantity" />
          </div>

          <div class="form__group">
            <label class="form__label">Discount percent</label>
            <input type="text" class="form__control" placeholder="Enter Discount percent" />
          </div>

          <div class="form__group">
            <label class="form__label">Expires at</label>
            <input type="date" class="form__control" placeholder="Enter Expires at" />
          </div>
        </div>
        <div class="flex justify-end items-center gap-2 mb-4">
          <span class="font-semibold">Final price: $49.99</span>
          <button class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Save</button>
        </div>

        <!-- Coupon List Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Code</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Discount %</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Expiry Date</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Redemptions</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Link</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-2">CODECODE</td>
                <td class="px-4 py-2">80% OFF</td>
                <td class="px-4 py-2">-</td>
                <td class="px-4 py-2">0/20</td>
                <td class="px-4 py-2">
                  <button class="text-blue-500 hover:underline">COPY LINK</button>
                </td>
                <td class="px-4 py-2">
                  <span class="text-red-500 font-semibold border border-red-500 px-2 py-1 rounded"
                    >INACTIVE</span
                  >
                </td>
              </tr>
              <tr>
                <td class="px-4 py-2">10OFF</td>
                <td class="px-4 py-2">20% OFF</td>
                <td class="px-4 py-2">30 Jun, 2023</td>
                <td class="px-4 py-2">0/100</td>
                <td class="px-4 py-2">
                  <button class="text-blue-500 hover:underline">COPY LINK</button>
                </td>
                <td class="px-4 py-2">
                  <span class="text-red-500 font-semibold border border-red-500 px-2 py-1 rounded"
                    >INACTIVE</span
                  >
                </td>
              </tr>
              <tr>
                <td class="px-4 py-2">YOUTUBEFANS100</td>
                <td class="px-4 py-2">60% OFF</td>
                <td class="px-4 py-2">-</td>
                <td class="px-4 py-2">0/200</td>
                <td class="px-4 py-2">
                  <button class="text-blue-500 hover:underline">COPY LINK</button>
                </td>
                <td class="px-4 py-2">
                  <span
                    class="text-green-500 font-semibold border border-green-500 px-2 py-1 rounded"
                    >ACTIVE</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </CourseLayout>
</template>

<style scoped></style>
