<template>
    <MainLayout>
        <div class="flex flex-col h-full w-full bg-light-bg dark:bg-[#131314] transition-colors duration-300 font-sans overflow-hidden p-6">
            <div class="max-w-4xl mx-auto w-full">
                <div class="mb-8 animate-fade-in-down">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Knowledge Base</h1>
                    <p class="text-gray-600 dark:text-gray-400">Upload documents to enhance the AI's knowledge.</p>
                </div>

                <!-- Upload Area -->
                <div 
                    class="mb-8 border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 backdrop-blur-xl"
                    :class="[
                        isDragging 
                            ? 'border-primary-500 bg-primary-500/10 dark:bg-primary-500/20 scale-[1.02]' 
                            : 'border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    ]"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleDrop"
                >
                    <input 
                        type="file" 
                        ref="fileInput" 
                        class="hidden" 
                        accept=".pdf,.txt"
                        @change="handleFileSelect"
                    >
                    
                    <div v-if="isUploading" class="py-4">
                        <i class="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
                        <p class="text-gray-600 dark:text-gray-300 font-medium">Processing document...</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a moment.</p>
                    </div>
                    
                    <div v-else class="cursor-pointer group" @click="$refs.fileInput.click()">
                        <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <i class="pi pi-cloud-upload text-3xl text-primary-600 dark:text-primary-400"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Click or Drag & Drop</h3>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Supported formats: PDF, TXT</p>
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg text-red-600 dark:text-red-400 flex items-center animate-shake">
                    <i class="pi pi-exclamation-circle mr-2 text-xl"></i>
                    {{ error }}
                </div>

                <!-- Documents List -->
                <div class="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Uploaded Documents</h2>
                        <span class="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">{{ documents.length }} files</span>
                    </div>

                    <div v-if="loading" class="p-12 text-center text-gray-500 dark:text-gray-400">
                        <i class="pi pi-spin pi-spinner mr-2 text-lg"></i> Loading documents...
                    </div>

                    <div v-else-if="documents.length === 0" class="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                        <i class="pi pi-folder-open text-4xl mb-3 opacity-50"></i>
                        <p>No documents uploaded yet.</p>
                    </div>

                    <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
                        <li v-for="doc in documents" :key="doc.id" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between group">
                            <div class="flex items-center min-w-0">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4 flex-shrink-0">
                                    <i class="pi pi-file-pdf text-red-500 text-xl" v-if="doc.filename.endsWith('.pdf')"></i>
                                    <i class="pi pi-file text-gray-500 dark:text-gray-400 text-xl" v-else></i>
                                </div>
                                <div class="min-w-0">
                                    <h3 class="text-gray-900 dark:text-white font-medium truncate pr-4" :title="doc.original_filename || doc.filename">
                                        {{ doc.original_filename || doc.filename }}
                                    </h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                                        <i class="pi pi-clock mr-1 text-[10px]"></i>
                                        {{ new Date(doc.uploaded_at).toLocaleDateString() }} 
                                        <span class="mx-2">•</span> 
                                        <span class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">{{ doc.chunk_count }} chunks</span>
                                    </p>
                                </div>
                            </div>
                            
                            <button 
                                @click="deleteDocument(doc.id)" 
                                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Delete document"
                            >
                                <i class="pi pi-trash"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiService } from '../services/api';
import MainLayout from '../layouts/MainLayout.vue';

const documents = ref([]);
const loading = ref(true);
const isUploading = ref(false);
const isDragging = ref(false);
const error = ref(null);
const fileInput = ref(null);

onMounted(loadDocuments);

async function loadDocuments() {
    try {
        loading.value = true;
        documents.value = await apiService.getDocuments();
    } catch (e) {
        error.value = 'Failed to load documents';
    } finally {
        loading.value = false;
    }
}

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
        error.value = 'Invalid file type. Please upload PDF or TXT.';
        return;
    }

    isUploading.value = true;
    error.value = null;

    try {
        await apiService.uploadDocument(file);
        await loadDocuments(); // Refresh list
    } catch (e) {
        error.value = e.message || 'Upload failed';
    } finally {
        isUploading.value = false;
        if (fileInput.value) fileInput.value.value = '';
    }
}

async function deleteDocument(id) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
        await apiService.deleteDocument(id);
        documents.value = documents.value.filter(d => d.id !== id);
    } catch (e) {
        error.value = 'Failed to delete document';
    }
}
</script>

<style scoped>
.animate-fade-in-down {
    animation: fadeInDown 0.5s ease-out;
}

.animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
