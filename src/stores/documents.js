import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/api';
import { useAuthStore } from './auth';

export const useDocumentsStore = defineStore('documents', () => {
    const documents = ref([]);
    const loading = ref(false);
    const loaded = ref(false);
    const error = ref(null);
    const authStore = useAuthStore();

    const fetchDocuments = async (force = false) => {
        if (loaded.value && !force) return;

        loading.value = true;
        error.value = null;
        try {
            const docs = await apiService.getDocuments();
            documents.value = docs;
            loaded.value = true;
        } catch (e) {
            console.error('Failed to fetch documents:', e);
            error.value = 'Failed to load documents';
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const uploadDocument = async (file) => {
        loading.value = true;
        error.value = null;
        try {
            await apiService.uploadDocument(file);
            // Invalidate cache to force refresh or fetch updated list
            await fetchDocuments(true);
        } catch (e) {
            console.error('Failed to upload document:', e);
            error.value = e.message || 'Upload failed';
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const deleteDocument = async (id) => {
        try {
            await apiService.deleteDocument(id);
            documents.value = documents.value.filter(d => d.id !== id);
        } catch (e) {
            console.error('Failed to delete document:', e);
            error.value = 'Failed to delete document';
            throw e;
        }
    };

    const reset = () => {
        documents.value = [];
        loaded.value = false;
        loading.value = false;
        error.value = null;
    };

    // Watch for logout
    authStore.$subscribe((mutation, state) => {
        if (!state.token) {
            reset();
        }
    });

    return {
        documents,
        loading,
        loaded,
        error,
        fetchDocuments,
        uploadDocument,
        deleteDocument,
        reset
    };
});
