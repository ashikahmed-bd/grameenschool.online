<script setup>
import BaseInput from '@/components/BaseInput.vue';
import BaseTextarea from '@/components/BaseTextarea.vue';
import Default from '@/layouts/Default.vue';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContactStore } from '@/stores/contact';

const route = useRoute();
const router = useRouter();
const contactStore = useContactStore();
const { errors, contact } = storeToRefs(contactStore);

const loadContact = async () => {
    await contactStore.show(route.params.id);
}

const update = async (contact) => {
    await contactStore.update(contact, router);
}

onMounted(() => {
    loadContact();
});


</script>

<template>
    <Default>
        <div class="card">
            <div class="card__header">
                <h3 class="card__title">View Contact</h3>
                <div class="flex items-center gap-2">
                    <select v-model="contact.status" class="form__select">
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <button type="button" @click="update(contact)" class="card__link" :disabled="contactStore.loading"
                        :class="{ 'opacity-50 cursor-not-allowed': contactStore.loading }">
                        Update
                    </button>
                </div>
            </div>

            <div class="card__body max-w-2xl">
                <div class="grid grid-cols-2 gap-4">
                    <BaseInput id="name" label="Name" v-model="contact.name" name="name" placeholder="Enter name"
                        :error="errors.name" :required="true" />

                    <BaseInput id="phone" label="Phone" v-model="contact.phone" name="phone" placeholder="Enter Phone"
                        :error="errors.phone" :required="true" />

                    <BaseInput id="email" label="Email" v-model="contact.email" name="email" placeholder="Enter email"
                        :error="errors.email" :required="true" />

                    <BaseInput id="subject" label="Subject" v-model="contact.subject" name="subject"
                        placeholder="Enter subject" :error="errors.subject" :required="true" />
                </div>

                <BaseTextarea id="message" label="Message" v-model="contact.message" name="message" placeholder="
                            Enter message" :error="errors.message" :required="true" />
            </div>
        </div>
    </Default>

</template>