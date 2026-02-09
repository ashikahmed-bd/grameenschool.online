<script setup>
import DataTableSkeleton from '@/components/DataTableSkeleton.vue';
import Default from '@/layouts/Default.vue';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useContactStore } from '@/stores/contact';

const contactStore = useContactStore();
const { contacts } = storeToRefs(contactStore);


const getContacts = async () => {
    await contactStore.all();
}


const deleteContact = async (contact) => {
    if (confirm('Are you sure you went to deleted this contact?')) {
        await contactStore.delete(contact);
        await getContacts();
    }
}

onMounted(() => {
    getContacts();
});


</script>

<template>
    <Default>
        <div class="card">
            <div class="card__header">
                <h3 class="card__title">Contacts List</h3>
            </div>

            <div class="card__body">
                <template v-if="contacts.data">
                    <div class="relative overflow-y-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="contact in contacts.data" :key="contact.id">
                                    <td>{{ contact.name }}</td>
                                    <td>{{ contact.phone }}</td>
                                    <td>{{ contact.email }}</td>
                                    <td>{{ contact.subject }}</td>
                                    <td>
                                        <span class="px-2 py-1 rounded-full text-xs font-semibold capitalize" :class="{
                                            'bg-yellow-100 text-yellow-800': contact.status === 'pending',
                                            'bg-blue-100 text-blue-800': contact.status === 'reviewed',
                                            'bg-green-100 text-green-800': contact.status === 'resolved'
                                        }">
                                            {{ contact.status }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="space-x-2">
                                            <RouterLink :to="{ name: 'contact.view', params: { id: contact.id } }"
                                                class="badge badge__success">
                                                View</RouterLink>
                                            <button class="badge badge__danger"
                                                @click.prevent="deleteContact(contact.id)">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Pagination class="mt-4" :total-items="contacts.meta.total"
                        :current-page="contacts.meta.current_page" :items-per-page="contacts.meta.per_page"
                        :pages-to-show="2" @page-change="getContacts" visible-always />
                </template>

                <template v-else>
                    <DataTableSkeleton />
                </template>
            </div>
        </div>
    </Default>

</template>