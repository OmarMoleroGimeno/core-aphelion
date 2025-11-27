<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const authStore = useAuthStore();
const router = useRouter();
const users = ref([]);
const newUser = ref({ email: '', username: '', password: '', role: 'user' });
const error = ref('');
const success = ref('');

const fetchUsers = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/users', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    users.value = await res.json();
  } catch (e) {
    error.value = e.message;
  }
};

const createUser = async () => {
  error.value = '';
  success.value = '';
  try {
    const res = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(newUser.value)
    });
    if (!res.ok) throw new Error(await res.text());
    
    success.value = 'User created successfully';
    newUser.value = { email: '', username: '', password: '', role: 'user' };
    fetchUsers();
  } catch (e) {
    error.value = e.message;
  }
};

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    const res = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (!res.ok) throw new Error('Failed to delete user');
    fetchUsers();
  } catch (e) {
    error.value = e.message;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <MainLayout>
    <div class="h-full overflow-y-auto p-8 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Panel</h1>
        </div>

        <!-- Create User -->
        <div class="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm dark:shadow-none mb-8 transition-colors duration-300">
          <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Create New User</h2>
          <form @submit.prevent="createUser" class="grid grid-cols-1 md:grid-cols-5 gap-5 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input v-model="newUser.email" type="email" required class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#151521] dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" placeholder="user@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
              <input v-model="newUser.username" type="text" required class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#151521] dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input v-model="newUser.password" type="password" required class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#151521] dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
              <select v-model="newUser.role" class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#151521] dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20 font-medium transition-all">Add User</button>
          </form>
          <p v-if="error" class="text-red-500 mt-3 text-sm font-medium">{{ error }}</p>
          <p v-if="success" class="text-green-500 mt-3 text-sm font-medium">{{ success }}</p>
        </div>

        <!-- User List -->
        <div class="bg-white dark:bg-dark-surface rounded-2xl shadow-sm dark:shadow-none overflow-hidden transition-colors duration-300">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 dark:bg-[#151521] border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Google ID</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-[#2b2b40]/50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{{ user.email }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{{ user.username }}</td>
                <td class="px-6 py-4">
                  <span :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'" class="px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{{ user.google_id ? '✓' : '-' }}</td>
                <td class="px-6 py-4">
                  <button @click="deleteUser(user.id)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
