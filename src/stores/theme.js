import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(localStorage.getItem('theme') === 'dark');
    const isSidebarExpanded = ref(true);

    const toggleTheme = () => {
        isDark.value = !isDark.value;
    };

    const setDark = (val) => {
        isDark.value = val;
    };

    const toggleSidebar = () => {
        isSidebarExpanded.value = !isSidebarExpanded.value;
    };

    const setSidebarExpanded = (val) => {
        isSidebarExpanded.value = val;
    };

    watch(isDark, (val) => {
        if (val) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, { immediate: true });

    return {
        isDark,
        isSidebarExpanded,
        toggleTheme,
        setDark,
        toggleSidebar,
        setSidebarExpanded
    };
});
