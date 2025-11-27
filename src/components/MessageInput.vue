<script setup>
import { ref } from 'vue';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['send']);

const message = ref('');

const handleSend = () => {
  if (!message.value.trim() || props.loading) return;
  emit('send', message.value);
  message.value = '';
};

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};
</script>

<template>
  <div class="w-full shrink-0 bg-transparent p-4 md:p-6 transition-colors duration-300">
    <div class="max-w-4xl align-center mx-auto relative flex gap-3">
      <div class="flex-1 relative">
        <Textarea 
          v-model="message" 
          autoResize 
          rows="1"
          placeholder="Type your message..." 
          class="w-full !pr-12 !py-3 !pl-4 !rounded-xl !border-zinc-300 dark:!border-zinc-700 focus:!border-orange-500 !bg-zinc-50 dark:!bg-zinc-900 focus:!bg-white dark:focus:!bg-zinc-900 dark:!text-white dark:placeholder-zinc-500 transition-colors !shadow-none focus:!shadow-sm"
          :disabled="loading"
          @keydown="handleKeydown"
        />
        <div class="absolute right-2 bottom-2 text-xs text-zinc-400 dark:text-zinc-500 pointer-events-none hidden md:block">
          Return to send
        </div>
      </div>
      
      <Button 
        icon="pi pi-send" 
        rounded 
        aria-label="Send"
        :loading="loading"
        :disabled="!message.trim() || loading"
        @click="handleSend"
        class="!w-12 !h-12 !shrink-0 !bg-orange-600 hover:!bg-orange-700 !border-none !shadow-md hover:!shadow-lg transition-all dark:text-white"
      />
    </div>
  </div>
</template>
