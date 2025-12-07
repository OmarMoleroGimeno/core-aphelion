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

    const uploadMultipleDocuments = async (files, onProgress) => {
        loading.value = true;
        error.value = null;
        const results = [];
        const errors = [];
        let completed = 0;

        try {
            // Upload files one by one (or in parallel)
            for (const file of files) {
                try {
                    const result = await apiService.uploadDocument(file);
                    results.push(result);
                } catch (e) {
                    console.error(`Failed to upload file ${file.name}:`, e);
                    errors.push({ file: file.name, error: e.message });
                } finally {
                    completed++;
                    if (onProgress) onProgress(completed, files.length);
                }
            }

            // Always fetch updated list if at least one succeeded
            if (results.length > 0) {
                await fetchDocuments(true);
            }

            if (errors.length > 0) {
                // If all failed, throw error. If partial, maybe set error state but don't throw?
                if (results.length === 0) {
                    throw new Error(`Failed to upload ${errors.length} files.`);
                } else {
                    // Partial success
                    error.value = `Uploaded ${results.length} files. Failed: ${errors.length}`;
                    // Allow UI to see error but also successful uploads
                }
            }
        } catch (e) {
            console.error('Failed to upload documents:', e);
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

    const deleteMultipleDocuments = async (ids) => {
        loading.value = true;
        try {
            await apiService.deleteMultipleDocuments(ids);
            // Update local state
            documents.value = documents.value.filter(d => !ids.includes(d.id));
        } catch (e) {
            console.error('Failed to delete documents:', e);
            error.value = 'Failed to delete some documents';
            // Fetch fresh list to ensure consistency
            await fetchDocuments(true);
            throw e;
        } finally {
            loading.value = false;
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
        uploadMultipleDocuments,
        deleteDocument,
        deleteMultipleDocuments,
        reset
    };
});
