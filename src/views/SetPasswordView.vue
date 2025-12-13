<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#09090b] px-4">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-[#18181b] p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
          <i class="pi pi-lock text-xl text-white"></i>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Establecer Contraseña</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Bienvenido a Aphelion. Configura tu acceso seguro.
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nueva Contraseña
            </label>
            <div class="mt-1">
              <Password 
                v-model="password" 
                toggleMask 
                :feedback="true"
                placeholder="Mínimo 6 caracteres"
                inputClass="w-full !bg-gray-50 dark:!bg-[#27272a] !border-gray-300 dark:!border-gray-700"
                class="w-full"
                :pt="{
                   input: { class: 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white' } 
                }"
              />
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar Contraseña
            </label>
            <div class="mt-1">
              <Password 
                v-model="confirmPassword" 
                :feedback="false"
                toggleMask 
                placeholder="Repite tu contraseña"
                inputClass="w-full !bg-gray-50 dark:!bg-[#27272a] !border-gray-300 dark:!border-gray-700"
                class="w-full"
                :pt="{
                   input: { class: 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white' } 
                }"
              />
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <i class="pi pi-exclamation-circle"></i>
            {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <i class="pi pi-check-circle"></i>
            Contraseña establecida. Redirigiendo...
        </div>

        <Button 
          type="submit" 
          label="Guardar y Acceder" 
          icon="pi pi-check"
          :loading="loading"
          class="w-full !bg-gradient-to-r !from-indigo-600 !to-purple-600 !border-none hover:!from-indigo-700 hover:!to-purple-700 !text-white !font-bold !py-3 !rounded-lg !shadow-lg !shadow-indigo-500/20 transition-all duration-200"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore();

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const token = ref('')
const isAuthenticatedMode = ref(false)

onMounted(() => {
    isAuthenticatedMode.value = route.query.mode === 'authenticated';
    token.value = route.query.token

    if (isAuthenticatedMode.value) {
        // En modo autenticado, verificamos que tengamos token de sesión
        if (!authStore.token) {
            error.value = 'Sesión no válida. Por favor inicia sesión de nuevo.';
            router.push('/login');
        }
    } else if (!token.value) {
        error.value = 'Token de invitación inválido o faltante.'
    }
})

const handleSubmit = async () => {
    error.value = ''
    
    if (!isAuthenticatedMode.value && !token.value) {
        error.value = 'Token inválido'
        return
    }

    if (password.value.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres'
        return
    }

    if (password.value !== confirmPassword.value) {
        error.value = 'Las contraseñas no coinciden'
        return
    }

    loading.value = true
    try {
        let url = 'http://localhost:3000/api/auth/set-password';
        let headers = { 'Content-Type': 'application/json' };
        let body = {};

        if (isAuthenticatedMode.value) {
            url = 'http://localhost:3000/api/auth/complete-setup';
            headers['Authorization'] = `Bearer ${authStore.token}`;
            body = { password: password.value };
        } else {
            body = { token: token.value, password: password.value };
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const msg = await response.text()
            throw new Error(msg || 'Error al establecer contraseña')
        }

        success.value = true
        setTimeout(() => {
            if (isAuthenticatedMode.value) {
                 router.push('/'); // Ya está logueado
            } else {
                router.push('/login?message=setup_complete');
            }
        }, 2000)

    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}
</script>
