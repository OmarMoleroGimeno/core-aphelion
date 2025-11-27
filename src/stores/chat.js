import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '../services/api';

export const useChatStore = defineStore('chat', () => {
    // State
    // State
    const messages = ref([]);
    const isLoading = ref(false);
    const threadId = ref(null);
    const error = ref(null);
    const threads = ref([]);

    // Getters
    const hasMessages = computed(() => messages.value.length > 0);

    // Actions
    async function fetchThreads() {
        try {
            const fetchedThreads = await apiService.getThreads();
            threads.value = fetchedThreads;
        } catch (e) {
            console.error('Failed to fetch threads:', e);
        }
    }

    async function loadThread(id) {
        threadId.value = id;
        isLoading.value = true;
        try {
            const history = await apiService.getMessages(id);
            messages.value = history;
        } catch (e) {
            console.error('Failed to load thread:', e);
            error.value = 'Failed to load conversation';
        } finally {
            isLoading.value = false;
        }
    }

    async function initializeChat() {
        await fetchThreads();
        if (!threadId.value && threads.value.length > 0) {
            // Load the most recent thread
            await loadThread(threads.value[0].id);
        }
    }

    async function sendMessage(content) {
        if (!content.trim() || isLoading.value) return;

        // Add user message immediately
        const userMessage = {
            id: Date.now().toString(),
            content,
            role: 'user',
            timestamp: new Date().toISOString()
        };
        messages.value.push(userMessage);

        isLoading.value = true;
        error.value = null;

        try {
            // Create thread if it doesn't exist (Lazy creation)
            if (!threadId.value) {
                const newId = await apiService.createThread();
                threadId.value = newId;
                // Add to threads list
                threads.value.unshift({
                    id: newId,
                    title: 'New Chat',
                    created_at: new Date().toISOString()
                });
            }

            const response = await apiService.sendMessage(content, threadId.value);

            // Add assistant response
            messages.value.push({
                id: Date.now().toString(),
                content: response.aiMessage.content,
                role: 'assistant',
                timestamp: response.aiMessage.timestamp
            });

            // Update title if changed
            if (response.newTitle) {
                const thread = threads.value.find(t => t.id === threadId.value);
                if (thread) {
                    thread.title = response.newTitle;
                } else {
                    await fetchThreads();
                }
            }

        } catch (e) {
            console.error('Failed to send message:', e);
            error.value = 'Failed to send message. Please try again.';
        } finally {
            isLoading.value = false;
        }
    }

    async function clearChat() {
        messages.value = [];
        error.value = null;
        threadId.value = null; // Reset thread ID, don't create yet
    }

    async function updateThreadTitle(id, title) {
        try {
            await apiService.updateThread(id, { title });
            const thread = threads.value.find(t => t.id === id);
            if (thread) thread.title = title;
        } catch (e) {
            console.error('Failed to update title:', e);
        }
    }

    async function deleteThread(id) {
        try {
            await apiService.deleteThread(id);
            threads.value = threads.value.filter(t => t.id !== id);
            if (threadId.value === id) {
                await clearChat();
            }
        } catch (e) {
            console.error('Failed to delete thread:', e);
        }
    }

    return {
        messages,
        threads,
        isLoading,
        threadId,
        error,
        hasMessages,
        initializeChat,
        fetchThreads,
        loadThread,
        sendMessage,
        clearChat,
        updateThreadTitle,
        deleteThread
    };
});
