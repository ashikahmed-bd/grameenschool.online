<script setup>
import DataTableSkeleton from '@/components/DataTableSkeleton.vue';
import Default from '@/layouts/Default.vue';
import { useBenefitStore } from '@/stores/benefit';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const benefitStore = useBenefitStore();
const { benefits } = storeToRefs(benefitStore);


const loadBenefits = async () => {
    await benefitStore.all();
}


const deleteBenefit = async (benefit) => {
    if (confirm('Are you sure you went to deleted this benefit?')) {
        await benefitStore.delete(benefit);
        await loadBenefits();
    }
}

onMounted(() => {
    loadBenefits();
});


</script>

<template>
    <Default>
        <div class="card">
            <div class="card__header">
                <h3 class="card__title">Benefits List</h3>
                <RouterLink :to="{ name: 'benefit.create' }" class="card__link">
                    Add New
                </RouterLink>
            </div>

            <div class="card__body">
                <template v-if="benefits.data">
                    <div class="relative overflow-y-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>Banner</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Sort</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="benefit in benefits.data" :key="benefit.id">
                                    <td>
                                        <img :src="benefit.banner_url" :alt="benefit.title"
                                            class="h-8 w-8 rounded object-cover" />
                                    </td>
                                    <td>{{ benefit.title }}</td>
                                    <td class="truncate max-w-xs">
                                        <span class="block truncate">{{ benefit.description }}</span>
                                    </td>
                                    <td>{{ benefit.sort_order }}</td>
                                    <td>
                                        <div class="space-x-2">
                                            <RouterLink :to="{ name: 'benefit.edit', params: { id: benefit.id } }"
                                                class="badge badge__success">
                                                Edit</RouterLink>
                                            <button class="badge badge__danger"
                                                @click.prevent="deleteBenefit(benefit.id)">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>

                <template v-else>
                    <DataTableSkeleton />
                </template>
            </div>
        </div>
    </Default>

</template>