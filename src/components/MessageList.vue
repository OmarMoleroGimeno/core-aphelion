<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import ScrollPanel from 'primevue/scrollpanel';
import MessageBubble from './MessageBubble.vue';

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const scrollPanelRef = ref(null);

const scrollToBottom = async () => {
  await nextTick();
  // PrimeVue ScrollPanel internal content wrapper
  const content = scrollPanelRef.value?.$el?.querySelector('.p-scrollpanel-content');
  if (content) {
    content.scrollTop = content.scrollHeight;
  }
};

// Scroll on new messages
watch(() => props.messages.length, scrollToBottom);
// Scroll when loading state changes (e.g. loading indicator appears)
watch(() => props.loading, scrollToBottom);

onMounted(scrollToBottom);
</script>

<template>
  <div class="flex-1 overflow-hidden relative bg-zinc-50 dark:bg-black transition-colors duration-300">
    <ScrollPanel 
      ref="scrollPanelRef" 
      class="w-full h-full custom-scrollbar"
      :pt="{
        wrapper: { class: 'h-full' },
        content: { class: 'p-4 md:p-6 max-w-4xl mx-auto flex flex-col' }
      }"
    >
      <!-- Empty State -->
      <div 
        v-if="messages.length === 0" 
        class="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center text-zinc-400 dark:text-zinc-500"
      >
        <div class="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <i class="pi pi-comments text-2xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Welcome to Rental Chat</h3>
        <p class="max-w-xs text-sm">
          Ask about our equipment availability, pricing, or rental terms.
        </p>
      </div>

      <!-- Messages -->
      <TransitionGroup name="message" tag="div">
        <MessageBubble 
          v-for="msg in messages" 
          :key="msg.id" 
          :message="msg" 
        />
      </TransitionGroup>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-start mb-6">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
          <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
      </div>
    </ScrollPanel>

    <!-- Gradient Fade -->
    <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-zinc-50 dark:from-black to-transparent pointer-events-none z-10"></div>
  </div>
</template>

<style scoped>
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}
.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
