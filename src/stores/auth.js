import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(localStorage.getItem('user') || null);
    const token = ref(localStorage.getItem('token') || null);
    const image = ref(localStorage.getItem('image') || null);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorTesdxt || 'Login failed');
            }

            const data = await response.json();
            console.log(data);
            token.value = data.token;
            user.value = data.username;
            image.value = data.image;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', data.username);
            localStorage.setItem('image', data.image);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const setToken = (newToken, newUsername, newImage) => {
        token.value = newToken;
        user.value = newUsername;
        image.value = newImage || null;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', newUsername);
        if (newImage) {
            localStorage.setItem('image', newImage);
        } else {
            localStorage.removeItem('image');
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('image');
    };

    return { user, token, image, login, logout, setToken };
});
