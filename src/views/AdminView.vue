<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const users = ref([]);
const newUser = ref({ email: '', username: '', password: '', role: 'user' });
const loading = ref(false);
const creating = ref(false);
const deleteDialogVisible = ref(false);
const userToDelete = ref(null);
const passwordDialogVisible = ref(false);
const userToChangePassword = ref(null);
const newPassword = ref('');
const changingPassword = ref(false);

const userCount = computed(() => users.value.length);
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length);
const regularUserCount = computed(() => users.value.filter(u => u.role === 'user').length);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await fetch('http://localhost:3000/api/users', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (!res.ok) {
      if (res.status === 403) {
        toast.add({ severity: 'error', summary: 'Access Denied', detail: 'You need admin privileges', life: 3000 });
        router.push('/');
        return;
      }
      throw new Error('Failed to fetch users');
    }
    users.value = await res.json();
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 });
  } finally {
    loading.value = false;
  }
};

const createUser = async () => {
  if (!newUser.value.email || !newUser.value.username || !newUser.value.password) {
    toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'All fields are required', life: 3000 });
    return;
  }

  creating.value = true;
  try {
    const res = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(newUser.value)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to create user');
    }
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'User created successfully', life: 3000 });
    newUser.value = { email: '', username: '', password: '', role: 'user' };
    await fetchUsers();
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 });
  } finally {
    creating.value = false;
  }
};

const confirmDelete = (user) => {
  userToDelete.value = user;
  deleteDialogVisible.value = true;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;
  
  try {
    const res = await fetch(`http://localhost:3000/api/users/${userToDelete.value.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    
    if (!res.ok) throw new Error('Failed to delete user');
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully', life: 3000 });
    await fetchUsers();
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 });
  } finally {
    deleteDialogVisible.value = false;
    userToDelete.value = null;
  }
};

const openPasswordDialog = (user) => {
  if (user.role === 'admin') {
    toast.add({ severity: 'warn', summary: 'Not Allowed', detail: 'Cannot change password of admin users', life: 3000 });
    return;
  }
  userToChangePassword.value = user;
  newPassword.value = '';
  passwordDialogVisible.value = true;
};

const changePassword = async () => {
  if (!newPassword.value || newPassword.value.length < 6) {
    toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'Password must be at least 6 characters', life: 3000 });
    return;
  }
  
  changingPassword.value = true;
  try {
    const res = await fetch(`http://localhost:3000/api/users/${userToChangePassword.value.id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ newPassword: newPassword.value })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to change password');
    }
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'Password changed successfully', life: 3000 });
    passwordDialogVisible.value = false;
    newPassword.value = '';
    userToChangePassword.value = null;
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 });
  } finally {
    changingPassword.value = false;
  }
};

onMounted(() => {
  if (authStore.userRole !== 'admin') {
    toast.add({ severity: 'error', summary: 'Access Denied', detail: 'Admin access required', life: 3000 });
    router.push('/');
    return;
  }
  fetchUsers();
});
</script>

<template>
  <MainLayout>
    <Toast />
    
    <div class="h-full overflow-y-auto bg-light-bg dark:bg-[#131314] transition-colors duration-300">
      <div class="max-w-7xl mx-auto p-4 md:p-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <i class="pi pi-shield text-2xl text-white"></i>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Panel</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Manage users and permissions</p>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-600/50">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ userCount }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <i class="pi pi-users text-xl text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-600/50">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Administrators</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ adminCount }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <i class="pi pi-shield text-xl text-purple-600 dark:text-purple-400"></i>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-600/50">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Regular Users</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ regularUserCount }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <i class="pi pi-user text-xl text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Create User Form -->
        <div class="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm dark:shadow-none mb-8 border border-gray-100 dark:border-gray-600/50">
          <div class="flex items-center gap-2 mb-6">
            <i class="pi pi-user-plus text-xl text-orange-600 dark:text-orange-400"></i>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Create New User</h2>
          </div>
          
          <form @submit.prevent="createUser" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i class="pi pi-envelope text-xs mr-1"></i> Email
                </label>
                <input 
                  v-model="newUser.email" 
                  type="email" 
                  required 
                  class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" 
                  placeholder="user@example.com" 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i class="pi pi-user text-xs mr-1"></i> Username
                </label>
                <input 
                  v-model="newUser.username" 
                  type="text" 
                  required 
                  class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" 
                  placeholder="John Doe" 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i class="pi pi-lock text-xs mr-1"></i> Password
                </label>
                <input 
                  v-model="newUser.password" 
                  type="password" 
                  required 
                  class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" 
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i class="pi pi-shield text-xs mr-1"></i> Role
                </label>
                <select 
                  v-model="newUser.role" 
                  class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              :loading="creating"
              :disabled="creating"
              label="Create User"
              icon="pi pi-plus"
              class="!bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700 !border-none !font-medium !shadow-lg !shadow-orange-500/20 dark:text-gray-200 dark:hover:!text-white"
            />
          </form>
        </div>

        <!-- User List -->
        <div class="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm dark:shadow-none overflow-hidden border border-gray-100 dark:border-gray-600/50">
          <div class="p-6 border-b border-gray-100 dark:border-gray-600/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="pi pi-users text-xl text-orange-600 dark:text-orange-400"></i>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">User List</h2>
              </div>
              <Button 
                icon="pi pi-refresh" 
                text 
                rounded 
                @click="fetchUsers"
                :loading="loading"
                class="!text-gray-500 dark:!text-gray-400"
              />
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-12 text-center">
            <i class="pi pi-spin pi-spinner text-4xl text-orange-500 mb-4"></i>
            <p class="text-gray-500 dark:text-gray-400">Loading users...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="users.length === 0" class="p-12 text-center">
            <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-users text-3xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No users yet</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">Create your first user to get started</p>
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-gray-50 dark:bg-[#131314] border-b border-gray-100 dark:border-gray-600">
                <tr>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <i class="pi pi-envelope mr-2"></i>Email
                  </th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <i class="pi pi-user mr-2"></i>Username
                  </th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <i class="pi pi-shield mr-2"></i>Role
                  </th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <i class="pi pi-google mr-2"></i>Google
                  </th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-600">
                <tr 
                  v-for="user in users" 
                  :key="user.id" 
                  class="hover:bg-gray-50 dark:hover:bg-[#2b2b40]/50 transition-colors"
                >
                  <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.username }}
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      :class="user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'" 
                      class="px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <i :class="user.role === 'admin' ? 'pi pi-shield' : 'pi pi-user'" class="text-[10px]"></i>
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span v-if="user.google_id" class="text-green-600 dark:text-green-400 text-sm font-medium">
                      <i class="pi pi-check-circle mr-1"></i> Linked
                    </span>
                    <span v-else class="text-gray-400 dark:text-gray-600 text-sm">
                      <i class="pi pi-minus-circle mr-1"></i> Not linked
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <Button 
                        v-if="user.role !== 'admin'"
                        icon="pi pi-key" 
                        severity="secondary"
                        text
                        rounded
                        @click="openPasswordDialog(user)"
                        class="!text-blue-500 hover:!bg-blue-50 dark:hover:!bg-blue-900/20"
                        v-tooltip.top="'Change Password'"
                      />
                      <Button 
                        icon="pi pi-trash" 
                        severity="danger"
                        text
                        rounded
                        @click="confirmDelete(user)"
                        class="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                        v-tooltip.top="'Delete User'"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      v-model:visible="deleteDialogVisible" 
      modal 
      header="Confirm Delete" 
      :style="{ width: '450px' }"
      class="dark:bg-dark-surface"
    >
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
          <i class="pi pi-exclamation-triangle text-xl text-red-600 dark:text-red-400"></i>
        </div>
        <div>
          <p class="text-gray-900 dark:text-white font-medium mb-2">
            Are you sure you want to delete this user?
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <strong>{{ userToDelete?.username }}</strong> ({{ userToDelete?.email }})
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This action cannot be undone.
          </p>
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Cancel" 
          text 
          @click="deleteDialogVisible = false"
          class="!text-gray-600 dark:!text-gray-400"
        />
        <Button 
          label="Delete" 
          severity="danger"
          @click="deleteUser"
          icon="pi pi-trash"
        />
      </template>
    </Dialog>

    <!-- Change Password Dialog -->
    <Dialog 
      v-model:visible="passwordDialogVisible" 
      modal 
      header="Change Password" 
      :style="{ width: '450px' }"
      class="dark:bg-dark-surface"
    >
      <div class="space-y-4">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
            <i class="pi pi-key text-xl text-blue-600 dark:text-blue-400"></i>
          </div>
          <div>
            <p class="text-gray-900 dark:text-white font-medium mb-1">
              Change password for user
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              <strong>{{ userToChangePassword?.username }}</strong> ({{ userToChangePassword?.email }})
            </p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <i class="pi pi-lock text-xs mr-1"></i> New Password
          </label>
          <input 
            v-model="newPassword" 
            type="password" 
            placeholder="Enter new password (min 6 characters)"
            class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#151521] dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
            @keyup.enter="changePassword"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Cancel" 
          text 
          @click="passwordDialogVisible = false"
          class="!text-gray-600 dark:!text-gray-400"
        />
        <Button 
          label="Change Password" 
          severity="info"
          @click="changePassword"
          icon="pi pi-check"
          :loading="changingPassword"
          :disabled="changingPassword"
        />
      </template>
    </Dialog>
  </MainLayout>
</template>

