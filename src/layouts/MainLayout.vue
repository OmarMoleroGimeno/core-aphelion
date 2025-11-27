<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { useChatStore } from '@/stores/chat';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const chatStore = useChatStore();

const { isDark } = themeStore;
const isAdmin = computed(() => authStore.userRole === 'admin');

const isSidebarExpanded = ref(true);
const isChatsExpanded = ref(true);
const isMobileMenuOpen = ref(false);

const toggleSidebar = () => {
    isSidebarExpanded.value = !isSidebarExpanded.value;
    if (!isSidebarExpanded.value) {
        isChatsExpanded.value = false;
    }
};

const toggleChats = () => {
    if (!isSidebarExpanded.value) {
        isSidebarExpanded.value = true;
        isChatsExpanded.value = true;
    } else {
        isChatsExpanded.value = !isChatsExpanded.value;
    }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const loadThread = async (id) => {
    await chatStore.loadThread(id);
    if (route.path !== '/') {
        router.push('/');
    }
    isMobileMenuOpen.value = false;
};

const createNewChat = async () => {
    await chatStore.clearChat();
    if (route.path !== '/') {
        router.push('/');
    }
    isMobileMenuOpen.value = false;
};

// Renaming & Menu Logic
const editingThreadId = ref(null);
const editTitle = ref('');
const menu = ref();
const selectedThread = ref(null);

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
                chatStore.deleteThread(selectedThread.value.id);
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

onMounted(async () => {
    if (authStore.token) {
        await chatStore.fetchThreads();
    }
});
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen w-full bg-light-bg dark:bg-dark-bg transition-colors duration-300 font-sans overflow-hidden">
    
    <!-- Context Menu (Shared) -->
    <Menu ref="menu" :model="menuItems" :popup="true" class="w-32" />

    <!-- Mobile Header -->
    <header class="md:hidden bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-gray-800/50 px-4 py-3 flex items-center justify-between z-30 shrink-0">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                <i class="pi pi-bolt text-lg text-white"></i>
            </div>
            <span class="font-bold text-lg text-gray-900 dark:text-white tracking-tight">Aphelion</span>
        </div>
        <Button icon="pi pi-ellipsis-v" text rounded @click="isMobileMenuOpen = !isMobileMenuOpen" class="!text-gray-600 dark:!text-gray-300" />
    </header>

    <!-- Desktop Sidebar (Left) -->
    <aside 
        class="hidden md:flex fixed inset-y-0 left-0 z-40 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-gray-800/50 flex-col shadow-sm transition-all duration-300 ease-in-out overflow-hidden relative"
        :class="isSidebarExpanded ? 'w-64' : 'w-20'"
    >
      <!-- Logo & Toggle -->
      <div 
        class="flex items-center h-20 pl-5 pr-4 relative cursor-pointer" 
        @click="!isSidebarExpanded && toggleSidebar()"
      >
        <div class="flex items-center gap-3 shrink-0">
            <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0 z-10 relative">
                <i class="pi pi-bolt text-xl text-white"></i>
            </div>
            <span 
                class="font-bold text-xl text-gray-900 dark:text-white tracking-tight whitespace-nowrap transition-all duration-300 origin-left"
                :class="isSidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'"
            >
                Aphelion
            </span>
        </div>
        
        <Button 
            icon="pi pi-angle-left" 
            text 
            rounded 
            severity="secondary" 
            class="!absolute !right-3 !w-8 !h-8 !text-gray-400 hover:!bg-gray-100 dark:hover:!bg-[#2b2b40] transition-all duration-300"
            :class="isSidebarExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'"
            @click.stop="toggleSidebar"
        />
      </div>

      <!-- Navigation (Desktop) -->
      <nav class="flex-1 px-3 space-y-2 py-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
        <!-- Users (Admin) -->
        <router-link 
          v-if="isAdmin"
          to="/admin"
          class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative"
          :class="route.path === '/admin' 
            ? 'bg-orange-50 dark:bg-[#2b2b40] text-orange-600 dark:text-orange-400' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2b2b40]/50 hover:text-gray-900 dark:hover:text-gray-200'"
        >
          <i class="pi pi-users text-xl shrink-0"></i>
          <span 
            class="font-medium whitespace-nowrap transition-all duration-300 origin-left"
            :class="isSidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'"
          >
            Users
          </span>
          <span v-if="!isSidebarExpanded" class="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Users</span>
        </router-link>

        <!-- Chats Section -->
        <div class="space-y-1">
            <div 
                @click="toggleChats"
                class="flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group hover:bg-gray-50 dark:hover:bg-[#2b2b40]/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 relative"
                :class="{'bg-gray-50 dark:bg-[#2b2b40]/30': isChatsExpanded && isSidebarExpanded}"
            >
                <div class="flex items-center gap-3">
                    <i class="pi pi-comments text-xl shrink-0"></i>
                    <span 
                        class="font-medium whitespace-nowrap transition-all duration-300 origin-left"
                        :class="isSidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'"
                    >
                        Chats
                    </span>
                </div>
                <i 
                    v-if="isSidebarExpanded" 
                    class="pi pi-chevron-down text-xs transition-transform duration-200" 
                    :class="{'rotate-180': isChatsExpanded}"
                ></i>
                <span v-if="!isSidebarExpanded" class="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Chats</span>
            </div>

            <!-- Chat List (Desktop) -->
            <div v-if="isSidebarExpanded && isChatsExpanded" class="pl-4 pr-1 space-y-1 mt-1">
                <Button 
                    label="New Chat" 
                    icon="pi pi-plus" 
                    class="w-full !bg-orange-600 hover:!bg-orange-700 !border-none !font-medium !text-sm !py-2 !mb-2" 
                    @click="createNewChat"
                />
                <div 
                    v-for="thread in chatStore.threads" 
                    :key="thread.id"
                    @click="loadThread(thread.id)"
                    class="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors relative"
                    :class="thread.id === chatStore.threadId 
                        ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-[#2b2b40]' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2b2b40]/30'"
                >
                    <div v-if="editingThreadId === thread.id" class="flex items-center gap-1 w-full" @click.stop>
                         <input 
                            v-model="editTitle" 
                            @keyup.enter="saveTitle(thread)"
                            @keyup.esc="editingThreadId = null"
                            class="w-full px-1.5 py-0.5 text-xs border border-orange-500 rounded bg-white dark:bg-zinc-800 dark:text-white outline-none"
                            autoFocus
                        />
                        <i class="pi pi-check text-green-500 cursor-pointer hover:text-green-600" @click="saveTitle(thread)"></i>
                        <i class="pi pi-times text-gray-400 cursor-pointer hover:text-gray-600" @click="editingThreadId = null"></i>
                    </div>
                    <template v-else>
                        <i class="pi pi-comment text-xs shrink-0 opacity-70"></i>
                        <span class="truncate flex-1">{{ thread.title }}</span>
                        <button 
                            @click="toggleMenu($event, thread)" 
                            class="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all absolute right-2"
                            title="Options"
                        >
                            <i class="pi pi-ellipsis-h text-[10px]"></i>
                        </button>
                    </template>
                </div>
            </div>
        </div>
      </nav>

      <!-- User Profile / Footer (Desktop) -->
      <div class="p-4 border-t border-gray-100 dark:border-gray-800/50">
        <div class="flex items-center gap-3 p-2 rounded-xl transition-colors" :class="{'justify-center': !isSidebarExpanded, 'bg-gray-50 dark:bg-[#151521]': isSidebarExpanded}">
            <div class="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-sm shrink-0 overflow-hidden">
                <img v-if="authStore.image" :src="authStore.image" alt="User" class="w-full h-full object-cover" />
                <span v-else>{{ authStore.user?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
            
            <div 
                class="flex flex-col min-w-0 flex-1 transition-all duration-300 origin-left"
                :class="isSidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'"
            >
                <span class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ authStore.user || 'User' }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ isAdmin ? 'Administrator' : 'User' }}</span>
            </div>

            <div 
                class="flex items-center gap-1 transition-all duration-300"
                :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'"
            >
                <Button 
                    icon="pi pi-sign-out" 
                    text 
                    rounded 
                    severity="secondary" 
                    class="!w-7 !h-7 !text-gray-400 hover:!text-red-500"
                    @click="handleLogout"
                />
            </div>
        </div>
      </div>
    </aside>

    <!-- Mobile Right Sidebar (Drawer) -->
    <div 
        class="md:hidden fixed inset-y-0 right-0 z-50 w-72 bg-white dark:bg-dark-surface shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-100 dark:border-gray-800/50"
        :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
    >
        <div class="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50">
            <span class="font-bold text-lg text-gray-900 dark:text-white">Menu</span>
            <Button icon="pi pi-times" text rounded @click="isMobileMenuOpen = false" class="!text-gray-500 dark:!text-gray-400" />
        </div>

        <nav class="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar space-y-4">
             <!-- User Info Mobile -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#151521]">
                <div class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-sm shrink-0 overflow-hidden">
                    <img v-if="authStore.image" :src="authStore.image" alt="User" class="w-full h-full object-cover" />
                    <span v-else>{{ authStore.user?.charAt(0).toUpperCase() || 'U' }}</span>
                </div>
                <div class="flex flex-col min-w-0 flex-1">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ authStore.user || 'User' }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ isAdmin ? 'Administrator' : 'User' }}</span>
                </div>
            </div>

            <!-- Navigation Links -->
            <router-link 
                v-if="isAdmin"
                to="/admin"
                class="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2b2b40]/50 hover:text-gray-900 dark:hover:text-gray-200"
                @click="isMobileMenuOpen = false"
            >
                <i class="pi pi-users text-xl"></i>
                <span class="font-medium">Users</span>
            </router-link>

            <div class="border-t border-gray-100 dark:border-gray-800/50 my-2"></div>

            <!-- Chats List Mobile -->
            <div>
                <div class="flex items-center justify-between mb-2 px-1">
                    <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chats</span>
                    <Button icon="pi pi-plus" text rounded size="small" class="!w-6 !h-6 !p-0" @click="createNewChat" />
                </div>
                <div class="space-y-1">
                     <div 
                        v-for="thread in chatStore.threads" 
                        :key="thread.id"
                        @click="loadThread(thread.id)"
                        class="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors"
                        :class="thread.id === chatStore.threadId 
                            ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-[#2b2b40]' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2b2b40]/30'"
                    >
                        <div class="flex items-center gap-2 truncate flex-1">
                            <i class="pi pi-comment text-xs opacity-70"></i>
                            <span class="truncate">{{ thread.title }}</span>
                        </div>
                        <Button 
                            icon="pi pi-ellipsis-h" 
                            text 
                            rounded 
                            class="!w-6 !h-6 !p-0 !text-gray-400" 
                            @click.stop="toggleMenu($event, thread)"
                        />
                    </div>
                </div>
            </div>
        </nav>

        <div class="p-4 border-t border-gray-100 dark:border-gray-800/50 flex gap-2">
            <Button 
                :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'" 
                :label="isDark ? 'Light Mode' : 'Dark Mode'"
                outlined
                class="flex-1 !border-gray-200 dark:!border-gray-700 !text-gray-600 dark:!text-gray-300"
                @click="themeStore.toggleTheme()"
            />
            <Button 
                icon="pi pi-sign-out" 
                label="Logout"
                severity="danger"
                outlined
                class="flex-1"
                @click="handleLogout"
            />
        </div>
    </div>

    <!-- Overlay for mobile -->
    <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
        @click="isMobileMenuOpen = false"
    ></div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative md:ml-0">
        <slot />
    </main>
  </div>
</template>
