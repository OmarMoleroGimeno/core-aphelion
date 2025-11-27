<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/stores/chat';
import { useThemeStore } from '@/stores/theme';
import MessageList from './MessageList.vue';
import MessageInput from './MessageInput.vue';
import Button from 'primevue/button';

const chatStore = useChatStore();
const themeStore = useThemeStore();
const { messages, isLoading } = storeToRefs(chatStore);
const { isDark } = storeToRefs(themeStore);
const { sendMessage, initializeChat } = chatStore;
const { toggleTheme } = themeStore;

const handleSendMessage = async (content) => {
    await sendMessage(content);
};

onMounted(() => {
  initializeChat();
});
</script>

<template>
  <div class="flex flex-col h-full w-full bg-light-bg dark:bg-dark-bg transition-colors duration-300 font-sans">
    <!-- Header (Simplified for Chat Actions) -->
    <header class="bg-white dark:bg-dark-surface px-6 py-4 flex items-center justify-between z-10 transition-colors duration-300 shadow-sm dark:shadow-none border-b border-gray-100 dark:border-gray-800/50">
      <div class="flex items-center gap-4">
        <div>
          <h1 class="font-bold text-gray-900 dark:text-white leading-tight tracking-tight text-lg">Chat</h1>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Online</span>
          </div>
        </div>
      </div>
      
      <Button 
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'" 
        text 
        rounded 
        severity="secondary" 
        @click="toggleTheme"
        class="!w-10 !h-10 !text-gray-500 dark:!text-gray-400 hover:!bg-gray-50 dark:hover:!bg-[#2b2b40]"
      />
    </header>

    <!-- Chat Area -->
    <MessageList 
      :messages="messages" 
      :loading="isLoading" 
    />

    <!-- Input Area -->
    <MessageInput 
      :loading="isLoading" 
      @send="handleSendMessage" 
    />
  </div>
</template>
