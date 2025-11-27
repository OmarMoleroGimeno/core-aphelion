import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(localStorage.getItem('user') || null);
    const token = ref(localStorage.getItem('token') || null);
    const image = ref(localStorage.getItem('image') || null);
    const role = ref(localStorage.getItem('role') || 'user');

    const userRole = computed(() => role.value);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Login failed');
            }

            const data = await response.json();
            console.log(data);
            token.value = data.token;
            user.value = data.username;
            image.value = data.image;
            role.value = data.role || 'user';

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', data.username);
            localStorage.setItem('image', data.image || '');
            localStorage.setItem('role', data.role || 'user');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const setToken = (newToken, newUsername, newImage, newRole) => {
        token.value = newToken;
        user.value = newUsername;
        image.value = newImage || null;
        role.value = newRole || 'user';

        localStorage.setItem('token', newToken);
        localStorage.setItem('user', newUsername);
        localStorage.setItem('role', newRole || 'user');

        if (newImage) {
            localStorage.setItem('image', newImage);
        } else {
            localStorage.removeItem('image');
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        image.value = null;
        role.value = 'user';

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('image');
        localStorage.removeItem('role');
    };

    return { user, token, image, role, userRole, login, logout, setToken };
});
