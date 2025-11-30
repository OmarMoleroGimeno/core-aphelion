<script setup>
import { onMounted, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores/chat';
import { useThemeStore } from '@/stores/theme';
import MessageList from './MessageList.vue';
import MessageInput from './MessageInput.vue';
import Button from 'primevue/button';

import { useRouter, useRoute } from 'vue-router';

const chatStore = useChatStore();
const themeStore = useThemeStore();
const router = useRouter();
const route = useRoute();
const { messages, isLoading, threads, threadId } = storeToRefs(chatStore);
const { isDark } = storeToRefs(themeStore);
const { sendMessage, initializeChat, loadThread, clearChat } = chatStore;
const { toggleTheme } = themeStore;

const currentThread = computed(() => threads.value.find(t => t.id === threadId.value));

const handleSendMessage = async (content) => {
    await sendMessage(content);
    // If it was a new chat and we got an ID, update URL
    if (threadId.value && route.name === 'new-chat') {
        router.replace(`/chats/${threadId.value}`);
    }
};

const goBack = () => {
    router.push('/chats');
};

const init = async () => {
    if (route.params.id) {
        await loadThread(route.params.id);
    } else if (route.name === 'new-chat') {
        clearChat();
    } else {
        // Fallback or other routes
    }
};

onMounted(() => {
    // Ensure threads are loaded so we can find the title
    chatStore.fetchThreads();
    init();
});

watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            loadThread(newId);
        } else if (route.name === 'new-chat') {
            clearChat();
        }
    }
);
</script>

<template>
  <div class="flex flex-col h-full w-full bg-light-bg dark:bg-[#131314] transition-colors duration-300 font-sans overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-md z-10">
        <Button 
            icon="pi pi-arrow-left" 
            text 
            rounded 
            class="!text-gray-600 dark:!text-gray-300 hover:!bg-gray-100 dark:hover:!bg-gray-800"
            @click="goBack"
        />
        <div class="flex flex-col">
            <h2 class="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate max-w-[200px] md:max-w-md">
                {{ currentThread?.title || 'New Chat' }}
            </h2>
            <span class="text-xs text-gray-500 dark:text-gray-400" v-if="currentThread">
                {{ new Date(currentThread.created_at).toLocaleDateString() }}
            </span>
        </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 min-h-0 relative flex flex-col">
        <Transition name="fade-slide" mode="out-in">
            <MessageList 
                v-if="chatStore.threadId"
                :key="chatStore.threadId"
                :messages="messages" 
                :loading="isLoading" 
                class="flex-1"
            />
            <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <i class="pi pi-comments text-4xl opacity-50"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Welcome to Aphelion</h3>
                <p class="text-sm">Select a chat or start a new conversation</p>
            </div>
        </Transition>
    </div>

    <!-- Input Area -->
    <MessageInput 
      :loading="isLoading" 
      @send="handleSendMessage"
      class="z-20 relative" 
    />
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
