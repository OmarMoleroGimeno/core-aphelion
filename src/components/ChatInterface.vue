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
  <div class="flex flex-col h-full w-full bg-light-bg dark:bg-[#131314] transition-colors duration-300 font-sans overflow-hidden">
    <!-- Chat Area -->
    <div class="flex-1 min-h-0 relative flex flex-col">
        <Transition name="fade-slide" mode="out-in">
            <MessageList 
                :key="chatStore.threadId"
                :messages="messages" 
                :loading="isLoading" 
                class="flex-1"
            />
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
