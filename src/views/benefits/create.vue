<script setup>
import BaseButton from '@/components/BaseButton.vue';
import BaseFile from '@/components/BaseFile.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseTextarea from '@/components/BaseTextarea.vue';
import Default from '@/layouts/Default.vue';
import { useBenefitStore } from '@/stores/benefit';
import { storeToRefs } from 'pinia';
import { onMounted, reactive } from 'vue';

const benefitStore = useBenefitStore();
const { errors } = storeToRefs(benefitStore);


const loadBenefits = async () => {
    await benefitStore.all();
}

const form = reactive({
    title: '',
    description: '',
    provider: '',
    video_id: '',
    sort_order: 0,
    banner: '',
});


const submit = async () => {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('provider', form.provider);
    formData.append('video_id', form.video_id);
    formData.append('sort_order', form.sort_order);
    if (form.banner) {
        formData.append('banner', form.banner);
    }
    await benefitStore.store(formData)
}


onMounted(() => {
    loadBenefits();
});


</script>

<template>
    <Default>
        <div class="card">
            <div class="card__header">
                <h3 class="card__title">Add Benefit</h3>
                <RouterLink :to="{ name: 'benefits' }" class="card__link">
                    All Benefits
                </RouterLink>
            </div>

            <div class="card__body">
                <form @submit.prevent="submit" enctype="multipart/form-data" class="max-w-2xl">
                    <BaseInput id="title" label="Title" v-model="form.title" name="title" placeholder="Enter title"
                        :error="errors.title" :required="true" />

                    <BaseTextarea id="description" label="Description" v-model="form.description" name="description"
                        placeholder="
                            Enter Overview" :error="errors.description" :required="true" />

                    <div class="grid grid-cols-2 gap-4">
                        <BaseSelect v-model="form.provider" for="provider" label="Provider" id="provider"
                            name="provider" :options="[
                                { id: 'youtube', name: 'Youtube' },
                                { id: 'vimeo', name: 'Vimeo' },
                            ]" :error="errors.role" :required="true" />

                        <BaseInput id="video_id" label="Video ID" v-model="form.video_id" name="video_id"
                            placeholder="Enter video_id" :error="errors.video_id" :required="true" />

                        <BaseInput id="sort_order" label="Sort Order" type="number" v-model="form.sort_order"
                            name="sort_order" placeholder="Enter sort order" :error="errors.sort_order"
                            :required="true" />

                        <BaseFile label="Cover" name="cover" @change="e => form.banner = e.target.files[0]"
                            :error="errors.banner" :required="true" />
                    </div>

                    <BaseButton :loading="benefitStore.loading">Submit</BaseButton>
                </form>
            </div>
        </div>
    </Default>

</template>