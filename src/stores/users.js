import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

export const useUsersStore = defineStore('users', () => {
    const users = ref([]);
    const loading = ref(false);
    const loaded = ref(false);
    const authStore = useAuthStore();

    const fetchUsers = async (force = false) => {
        if (loaded.value && !force) return;

        loading.value = true;
        try {
            const res = await fetch('http://localhost:3000/api/users', {
                headers: { 'Authorization': `Bearer ${authStore.token}` }
            });

            if (!res.ok) {
                if (res.status === 403) {
                    throw new Error('Access Denied: You need admin privileges');
                }
                throw new Error('Failed to fetch users');
            }

            users.value = await res.json();
            loaded.value = true;
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const createUser = async (userData) => {
        loading.value = true;
        try {
            const res = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify(userData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to create user');
            }

            // Optimistic update or re-fetch? Let's do optimistic update for speed
            // But we might need the ID from the server. Assuming server returns the created user or we re-fetch.
            // For simplicity and correctness, let's re-fetch or just append if we trust the data.
            // Ideally the backend returns the created user. Let's assume we might need to re-fetch to be safe or just invalidate cache.
            // Actually, let's just invalidate loaded to force a refresh next time, or fetch immediately.
            await fetchUsers(true);
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const deleteUser = async (userId) => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authStore.token}` }
            });

            if (!res.ok) throw new Error('Failed to delete user');

            users.value = users.value.filter(u => u.id !== userId);
        } catch (error) {
            throw error;
        }
    };

    const changePassword = async (userId, newPassword) => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify({ newPassword })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to change password');
            }
        } catch (error) {
            throw error;
        }
    };

    const reset = () => {
        users.value = [];
        loaded.value = false;
        loading.value = false;
    };

    // Watch for logout
    authStore.$subscribe((mutation, state) => {
        if (!state.token) {
            reset();
        }
    });

    return {
        users,
        loading,
        loaded,
        fetchUsers,
        createUser,
        deleteUser,
        changePassword,
        reset
    };
});
