<script setup>
import { computed } from 'vue';
import { parseMarkdown } from '@/utils/markdown';

const props = defineProps({
  message: {
    type: Object,
    required: true,
    validator: (msg) => msg.content && msg.role && msg.timestamp
  }
});

const isUser = computed(() => props.message.role === 'user');

const bubbleClasses = computed(() => {
  return isUser.value
    ? 'bg-orange-600 text-white rounded-br-none'
    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm';
});

const timeString = computed(() => {
  return new Date(props.message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
});

const parsedContent = computed(() => parseMarkdown(props.message.content));
</script>

<template>
  <div class="flex w-full mb-6" :class="isUser ? 'justify-end' : 'justify-start'">
    <div 
      class="flex flex-col max-w-[85%] md:max-w-[70%]"
      :class="isUser ? 'items-end' : 'items-start'"
    >
      <!-- Sender Name (Optional) -->
      <span class="text-xs text-zinc-400 dark:text-zinc-500 mb-1 px-1">
        {{ isUser ? 'You' : 'Assistant' }}
      </span>

      <!-- Message Bubble -->
      <div 
        class="px-4 py-3 rounded-2xl transition-all duration-200"
        :class="bubbleClasses"
      >
        <!-- Content -->
        <div 
          v-if="!isUser"
          class="markdown-content"
          v-html="parsedContent"
        ></div>
        <div v-else class="whitespace-pre-wrap">{{ message.content }}</div>
      </div>

      <!-- Timestamp -->
      <span class="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 px-1 opacity-70">
        {{ timeString }}
      </span>
    </div>
  </div>
</template>
