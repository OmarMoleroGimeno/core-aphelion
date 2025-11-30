<script setup>
import { ref, onMounted } from 'vue';
import { useDocumentsStore } from '../stores/documents';
import { storeToRefs } from 'pinia';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const documentsStore = useDocumentsStore();
const { documents, loading, error } = storeToRefs(documentsStore);
const isUploading = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});

onMounted(() => {
    documentsStore.fetchDocuments();
});

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) await uploadFile(file);
}

function handleDrop(event) {
    isDragging.value = false;
    const file = event.dataTransfer.files[0];
    if (file) uploadFile(file);
}

async function uploadFile(file) {
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
        alert('Invalid file type. Please upload PDF or TXT.'); 
        return;
    }

    isUploading.value = true;

    try {
        await documentsStore.uploadDocument(file);
    } catch (e) {
        // Error is handled in store state
    } finally {
        isUploading.value = false;
        if (fileInput.value) fileInput.value.value = '';
    }
}

async function deleteDocument(id) {
    if (!confirm('Are you sure you want to delete this document?')) return;
    await documentsStore.deleteDocument(id);
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

const formatSize = (bytes) => {
    console.log(bytes);
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<template>
    <div class="h-full w-full">
        <Toast />
        <div class="h-full overflow-y-auto bg-light-bg dark:bg-[#131314] transition-colors duration-300">
            <div class="max-w-7xl mx-auto p-4 md:p-8">
                <!-- Header -->
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <i class="pi pi-book text-2xl text-white"></i>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Knowledge Base</h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Manage your documents and resources</p>
                        </div>
                    </div>
                </div>

                <!-- Upload Area -->
                <div class="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-sm dark:shadow-none mb-8 border border-gray-100 dark:border-gray-600/50 text-center">
                    <div 
                        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer"
                        :class="{'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10': isDragging}"
                        @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false"
                        @drop.prevent="handleDrop"
                        @click="$refs.fileInput.click()"
                    >
                        <input 
                            type="file" 
                            ref="fileInput" 
                            class="hidden" 
                            accept=".pdf,.txt"
                            @change="handleFileSelect"
                        />
                        <div v-if="isUploading">
                            <i class="pi pi-spin pi-spinner text-4xl text-indigo-600 dark:text-indigo-400 mb-4"></i>
                            <p class="text-gray-600 dark:text-gray-300 font-medium">Uploading...</p>
                        </div>
                        <div v-else>
                            <div class="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="pi pi-cloud-upload text-3xl text-indigo-600 dark:text-indigo-400"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload Documents</h3>
                            <p class="text-gray-500 dark:text-gray-400 mb-4">Drag and drop files here, or click to browse</p>
                            <Button 
                                label="Select Files" 
                                icon="pi pi-folder-open" 
                                class="!bg-indigo-600 hover:!bg-indigo-700 !border-none"
                            />
                        </div>
                    </div>
                </div>

                <!-- Documents List -->
                <div class="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm dark:shadow-none overflow-hidden border border-gray-100 dark:border-gray-600/50">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-600/50">
                        <div class="flex items-center justify-between flex-wrap gap-4">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-file text-xl text-indigo-600 dark:text-indigo-400"></i>
                                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Documents</h2>
                            </div>
                            <div class="flex items-center gap-2">
                                <IconField iconPosition="left">
                                    <InputIcon class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search documents..." class="!py-2" />
                                </IconField>
                                <Button 
                                    icon="pi pi-refresh" 
                                    text 
                                    rounded 
                                    @click="documentsStore.fetchDocuments()"
                                    :loading="loading"
                                    class="!text-gray-500 dark:!text-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    <DataTable 
                        :value="documents" 
                        :loading="loading" 
                        stripedRows 
                        class="w-full" 
                        paginator 
                        :rows="5" 
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        v-model:filters="filters"
                        :globalFilterFields="['filename']"
                        :pt="{ 
                        headerRow: { class: 'bg-gray-50 dark:bg-[#131314] text-gray-500 dark:text-gray-400' },
                        bodyRow: { class: 'hover:bg-gray-50 dark:hover:bg-[#2b2b40]/50 transition-colors' }
                    }">
                         <template #empty>
                            <div class="p-12 text-center">
                                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="pi pi-file text-3xl text-gray-400"></i>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No documents yet</h3>
                                <p class="text-gray-500 dark:text-gray-400 text-sm">Upload files to get started</p>
                            </div>
                        </template>

                        <Column field="filename" header="Name">
                            <template #body="slotProps">
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-file-pdf text-red-500 text-xl" v-if="slotProps.data.filename.endsWith('.pdf')"></i>
                                    <i class="pi pi-file text-gray-500 text-xl" v-else></i>
                                    <span class="font-medium text-gray-900 dark:text-white">{{ slotProps.data.filename }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="uploaded_at" header="Date">
                            <template #body="slotProps">
                                <span class="text-gray-500 dark:text-gray-400">{{ formatDate(slotProps.data.uploaded_at) }}</span>
                            </template>
                        </Column>
                        <Column field="size" header="Size">
                            <template #body="slotProps">
                                <span class="text-gray-500 dark:text-gray-400">{{ formatSize(slotProps.data.size) }}</span>
                            </template>
                        </Column>
                        <Column header="Actions" :exportable="false" style="min-width:8rem">
                            <template #body="slotProps">
                                <Button 
                                    icon="pi pi-trash" 
                                    severity="danger" 
                                    text 
                                    rounded 
                                    @click="deleteDocument(slotProps.data.id)"
                                    class="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                                />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
