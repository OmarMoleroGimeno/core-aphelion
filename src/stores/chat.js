import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '../services/api';
import { useAuthStore } from './auth';

export const useChatStore = defineStore('chat', () => {
    // State
    const messages = ref([]);
    const isLoading = ref(false);
    const threadId = ref(null);
    const error = ref(null);
    const threads = ref([]);
    const threadsLoaded = ref(false);
    const messagesCache = ref({}); // { threadId: [messages] }
    const authStore = useAuthStore();

    // Getters
    const hasMessages = computed(() => messages.value.length > 0);

    // Actions
    async function fetchThreads(force = false) {
        if (threadsLoaded.value && !force) return;

        try {
            const fetchedThreads = await apiService.getThreads();
            threads.value = fetchedThreads;
            threadsLoaded.value = true;
        } catch (e) {
            console.error('Failed to fetch threads:', e);
        }
    }

    async function loadThread(id) {
        threadId.value = id;

        // Check cache first
        if (messagesCache.value[id]) {
            messages.value = messagesCache.value[id];
            return;
        }

        isLoading.value = true;
        try {
            const history = await apiService.getMessages(id);
            messages.value = history;
            messagesCache.value[id] = history; // Update cache
        } catch (e) {
            console.error('Failed to load thread:', e);
            error.value = 'Failed to load conversation';
        } finally {
            isLoading.value = false;
        }
    }

    async function initializeChat() {
        await fetchThreads();
        // Auto-load removed as per requirement
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

        // Update cache
        if (threadId.value) {
            if (!messagesCache.value[threadId.value]) {
                messagesCache.value[threadId.value] = [];
            }
            // Only push to cache if it's a different array reference
            if (messages.value !== messagesCache.value[threadId.value]) {
                messagesCache.value[threadId.value].push(userMessage);
            }
        }

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
                // Initialize cache for new thread
                messagesCache.value[newId] = [userMessage];
            }

            const response = await apiService.sendMessage(content, threadId.value);

            const assistantMessage = {
                id: Date.now().toString(),
                content: response.aiMessage.content,
                role: 'assistant',
                timestamp: response.aiMessage.timestamp
            };

            // Add assistant response
            messages.value.push(assistantMessage);

            // Update cache
            if (messagesCache.value[threadId.value] && messages.value !== messagesCache.value[threadId.value]) {
                messagesCache.value[threadId.value].push(assistantMessage);
            }


            // Update title if changed
            if (response.newTitle) {
                const thread = threads.value.find(t => t.id === threadId.value);
                if (thread) {
                    thread.title = response.newTitle;
                } else {
                    await fetchThreads(true);
                }
            }

        } catch (e) {
            console.error('Failed to send message:', e);
            error.value = 'Failed to send message. Please try again.';
            // Remove user message on failure (optional, but good UX)
            messages.value.pop();
            if (threadId.value && messagesCache.value[threadId.value]) {
                messagesCache.value[threadId.value].pop();
            }

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
            // Remove from cache
            delete messagesCache.value[id];
        } catch (e) {
            console.error('Failed to delete thread:', e);
        }
    }

    function reset() {
        messages.value = [];
        isLoading.value = false;
        threadId.value = null;
        error.value = null;
        threads.value = [];
        threadsLoaded.value = false;
        messagesCache.value = {};
    }

    // Watch for logout
    authStore.$subscribe((mutation, state) => {
        if (!state.token) {
            reset();
        }
    });

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
        deleteThread,
        reset
    };
});
