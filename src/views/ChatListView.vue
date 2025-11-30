<script setup>
import { ref, computed, onMounted } from 'vue';
import { useChatStore } from '../stores/chat';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';

const chatStore = useChatStore();
const router = useRouter();
const searchQuery = ref('');
const menu = ref();
const selectedThread = ref(null);
const editingThreadId = ref(null);
const editTitle = ref('');

// Ensure threads are loaded
onMounted(() => {
    chatStore.fetchThreads();
});

const filteredThreads = computed(() => {
    if (!searchQuery.value) return chatStore.threads;
    return chatStore.threads.filter(thread => 
        thread.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const openChat = (id) => {
    router.push(`/chats/${id}`);
};

const createNewChat = () => {
    router.push('/chats/new');
};

const menuItems = ref([
    {
        label: 'Rename',
        icon: 'pi pi-pencil',
        command: () => {
            if (selectedThread.value) {
                editingThreadId.value = selectedThread.value.id;
                editTitle.value = selectedThread.value.title;
            }
        }
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        class: 'text-red-600',
        command: () => {
            if (selectedThread.value) {
                if (confirm('Are you sure you want to delete this chat?')) {
                    chatStore.deleteThread(selectedThread.value.id);
                }
            }
        }
    }
]);

const toggleMenu = (event, thread) => {
    event.stopPropagation();
    selectedThread.value = thread;
    menu.value.toggle(event);
};

const saveTitle = async (thread) => {
  if (!editTitle.value.trim()) return;
  await chatStore.updateThreadTitle(thread.id, editTitle.value);
  editingThreadId.value = null;
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<template>
    <div class="h-full w-full">
        <div class="flex flex-col h-full w-full bg-light-bg dark:bg-[#131314] transition-colors duration-300 font-sans overflow-hidden">
            <div class="max-w-7xl mx-auto p-4 md:p-8 w-full h-full flex flex-col">
                <!-- Header -->
                <div class="mb-8 shrink-0">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <i class="pi pi-comments text-2xl text-white"></i>
                            </div>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Chats</h1>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Manage your conversations</p>
                            </div>
                        </div>
                        <Button 
                            label="New Chat" 
                            icon="pi pi-plus" 
                            @click="createNewChat"
                            class="!bg-gradient-to-r !from-orange-500 !text-white !to-orange-600 hover:!from-orange-600 hover:!to-orange-700 !border-none !font-medium !shadow-lg !shadow-orange-500/20"
                        />
                    </div>
                </div>

                <!-- Search -->
                <div class="mb-6 shrink-0">
                    <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText 
                            v-model="searchQuery" 
                            placeholder="Search chats..." 
                            class="w-full md:w-96 !bg-white dark:!bg-[#1E1E1E] !border-gray-200 dark:!border-gray-700" 
                        />
                    </IconField>
                </div>

                <!-- Chat List -->
                <div class="flex-1 overflow-y-auto custom-scrollbar">
                    <Transition name="fade" mode="out-in">
                        <div v-if="filteredThreads.length === 0" key="empty" class="text-center py-12">
                            <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="pi pi-comments text-3xl text-gray-400"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No chats found</h3>
                            <p class="text-gray-500 dark:text-gray-400 text-sm">Start a new conversation to get started</p>
                        </div>

                        <TransitionGroup 
                            v-else
                            key="list"
                            name="list" 
                            tag="div" 
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            <div 
                                v-for="(thread, index) in filteredThreads" 
                                :key="thread.id"
                                class="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500/50 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                                @click="openChat(thread.id)"
                                :style="{ transitionDelay: `${index * 50}ms` }"
                            >
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex-1 min-w-0 mr-2">
                                        <div v-if="editingThreadId === thread.id" class="flex items-center gap-1" @click.stop>
                                            <input 
                                                v-model="editTitle" 
                                                @keyup.enter="saveTitle(thread)"
                                                @keyup.esc="editingThreadId = null"
                                                class="w-full px-2 py-1 text-sm border border-orange-500 rounded bg-white dark:bg-zinc-800 dark:text-white outline-none"
                                                autoFocus
                                            />
                                            <i class="pi pi-check text-green-500 cursor-pointer hover:text-green-600" @click="saveTitle(thread)"></i>
                                            <i class="pi pi-times text-gray-400 cursor-pointer hover:text-gray-600" @click="editingThreadId = null"></i>
                                        </div>
                                        <h3 v-else class="font-semibold text-gray-900 dark:text-white truncate" :title="thread.title">
                                            {{ thread.title }}
                                        </h3>
                                    </div>
                                    <Button 
                                        icon="pi pi-ellipsis-h" 
                                        text 
                                        rounded 
                                        class="!w-8 !h-8 !p-0 !text-gray-400 hover:!text-gray-600 dark:hover:!text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                        @click="toggleMenu($event, thread)"
                                    />
                                </div>
                                <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <i class="pi pi-clock mr-1"></i>
                                    {{ formatDate(thread.created_at) }}
                                </p>
                            </div>
                        </TransitionGroup>
                    </Transition>
                </div>
            </div>
        </div>

        <!-- Context Menu -->
        <Menu ref="menu" :model="menuItems" :popup="true" />
    </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
