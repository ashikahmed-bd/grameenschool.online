<script setup>
import { onMounted } from 'vue';
import { useBackupStore } from '@/stores/backup';
import { storeToRefs } from 'pinia';

const backupStore = useBackupStore();
const { backups } = storeToRefs(backupStore);

const loadBackup = async () => {
    await backupStore.all();
};

const download = async (url) => {
    await backupStore.download(url);
}

onMounted(() => {
    loadBackup();
});

</script>

<template>
    <div class="space-y-2 mb-6 max-w-3xl">
        <div class="flex items-start justify-between">
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-gray-800">System Backup</h2>
                <p class="text-gray-500 mt-1">
                    Download the latest system backup with a single click.
                </p>
            </div>
            <button @click="backupStore.create()" :disabled="backupStore.loading" class="px-4 py-2 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md 
           hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
                <template v-if="backupStore.loading">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                        </path>
                    </svg>
                    Creating...
                </template>
                <template v-else>
                    Create
                </template>
            </button>

        </div>


        <template v-if="backups.backups">
            <div v-for="backup in backups.backups" class="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                <div>
                    <p class="font-medium text-gray-700">Latest Backup:</p>
                    <p class="text-gray-500 text-sm">{{ backup.file }}</p>
                </div>
                <button @click="backupStore.download(backup.file)"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Download
                </button>
            </div>
        </template>

        <template v-else>
            <div class="text-gray-500">No backup available.</div>
        </template>
    </div>
</template>
