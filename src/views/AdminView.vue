<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useUsersStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const authStore = useAuthStore();
const usersStore = useUsersStore();
const { users, loading } = storeToRefs(usersStore);
const router = useRouter();
const toast = useToast();

const newUser = ref({ email: '', username: '', password: '', role: 'user' });
const creating = ref(false);
const deleteDialogVisible = ref(false);
const userToDelete = ref(null);
const passwordDialogVisible = ref(false);
const userToChangePassword = ref(null);
const newPassword = ref('');
const changingPassword = ref(false);

const roles = ref([
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' }
]);

const userCount = computed(() => users.value.length);
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length);
const regularUserCount = computed(() => users.value.filter(u => u.role === 'user').length);

const loadUsers = async (force = false) => {
  try {
    await usersStore.fetchUsers(force);
  } catch (e) {
    if (e.message.includes('Access Denied')) {
        toast.add({ severity: 'error', summary: 'Access Denied', detail: 'You need admin privileges', life: 3000 });
        router.push('/');
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 });
    }
  }
};

const handleCreateUser = async () => {
  if (!newUser.value.email || !newUser.value.username || !newUser.value.password) {
    toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'All fields are required', life: 3000 });
    return;
  }

  creating.value = true;
  try {
    await usersStore.createUser(newUser.value);
    toast.add({ severity: 'success', summary: 'Success', detail: 'User created successfully', life: 3000 });
    newUser.value = { email: '', username: '', password: '', role: 'user' };
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

const handleDeleteUser = async () => {
  if (!userToDelete.value) return;
  
  try {
    await usersStore.deleteUser(userToDelete.value.id);
    toast.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully', life: 3000 });
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

const handleChangePassword = async () => {
  if (!newPassword.value || newPassword.value.length < 6) {
    toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'Password must be at least 6 characters', life: 3000 });
    return;
  }
  
  changingPassword.value = true;
  try {
    await usersStore.changePassword(userToChangePassword.value.id, newPassword.value);
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
  loadUsers();
});
</script>

<template>
    <div class="h-full w-full">
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
              
              <form @submit.prevent="handleCreateUser" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <IconField>
                        <InputIcon class="pi pi-envelope" />
                        <InputText 
                            v-model="newUser.email" 
                            type="email" 
                            placeholder="user@example.com" 
                            class="w-full" 
                            required
                        />
                    </IconField>
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <IconField>
                        <InputIcon class="pi pi-user" />
                        <InputText 
                            v-model="newUser.username" 
                            type="text" 
                            placeholder="John Doe" 
                            class="w-full" 
                            required
                        />
                    </IconField>
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Password 
                        v-model="newUser.password" 
                        :feedback="false" 
                        toggleMask 
                        placeholder="••••••••" 
                        inputClass="w-full"
                        class="w-full"
                        required
                    />
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <Select 
                        v-model="newUser.role" 
                        :options="roles" 
                        optionLabel="label" 
                        optionValue="value" 
                        placeholder="Select a Role" 
                        class="w-full"
                    />
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
                    @click="loadUsers(true)"
                    :loading="loading"
                    class="!text-gray-500 dark:!text-gray-400"
                  />
                </div>
              </div>

              <DataTable :value="users" :loading="loading" stripedRows class="w-full" :pt="{ 
                  headerRow: { class: 'bg-gray-50 dark:bg-[#131314] text-gray-500 dark:text-gray-400' },
                  bodyRow: { class: 'hover:bg-gray-50 dark:hover:bg-[#2b2b40]/50 transition-colors' }
              }">
                <template #empty>
                    <div class="p-12 text-center">
                        <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="pi pi-users text-3xl text-gray-400"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No users yet</h3>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Create your first user to get started</p>
                    </div>
                </template>
                
                <Column field="email" header="Email">
                    <template #body="slotProps">
                        <span class="text-gray-700 dark:text-gray-300">{{ slotProps.data.email }}</span>
                    </template>
                </Column>
                <Column field="username" header="Username">
                    <template #body="slotProps">
                        <span class="font-medium text-gray-900 dark:text-white">{{ slotProps.data.username }}</span>
                    </template>
                </Column>
                <Column field="role" header="Role">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.role" :severity="slotProps.data.role === 'admin' ? 'warn' : 'info'" />
                    </template>
                </Column>
                <Column header="Google">
                    <template #body="slotProps">
                        <span v-if="slotProps.data.google_id" class="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1">
                          <i class="pi pi-check-circle"></i> Linked
                        </span>
                        <span v-else class="text-gray-400 dark:text-gray-600 text-sm flex items-center gap-1">
                          <i class="pi pi-minus-circle"></i> Not linked
                        </span>
                    </template>
                </Column>
                <Column header="Actions" :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button 
                                v-if="slotProps.data.role !== 'admin'"
                                icon="pi pi-key" 
                                severity="secondary"
                                text
                                rounded
                                @click="openPasswordDialog(slotProps.data)"
                                class="!text-blue-500 hover:!bg-blue-50 dark:hover:!bg-blue-900/20"
                                v-tooltip.top="'Change Password'"
                            />
                            <Button 
                                icon="pi pi-trash" 
                                severity="danger"
                                text
                                rounded
                                @click="confirmDelete(slotProps.data)"
                                class="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                                v-tooltip.top="'Delete User'"
                            />
                        </div>
                    </template>
                </Column>
              </DataTable>
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
              @click="handleDeleteUser"
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

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <Password 
                v-model="newPassword" 
                :feedback="true" 
                toggleMask 
                placeholder="Enter new password (min 6 characters)"
                inputClass="w-full"
                class="w-full"
                @keyup.enter="handleChangePassword"
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
              @click="handleChangePassword"
              icon="pi pi-check"
              :loading="changingPassword"
              :disabled="changingPassword"
            />
          </template>
        </Dialog>
    </div>
</template>
