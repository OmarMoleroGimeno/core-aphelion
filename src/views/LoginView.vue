<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const error = ref('');

// Check for Google Auth token
if (route.query.token) {
  const token = route.query.token;
  const user = route.query.username;
  const image = route.query.image;
  const role = route.query.role || 'user';
  authStore.setToken(token, user, image, role);
  router.push('/');
}

// Check for access denied error
if (route.query.error === 'access_denied') {
  error.value = 'Access denied. You must be registered by an admin to use Google Sign-In.';
}

const handleSubmit = async () => {
  error.value = '';
  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (e) {
    error.value = e.message || 'An error occurred';
  }
};
</script>

<template>
  <div class="min-h-screen flex bg-[#0f172a]">
    <!-- Left Side - Login Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-[#0f172a] text-white relative">
      <!-- Decorative dots top left -->
      <div class="absolute top-8 left-8 flex gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>

      <div class="w-full max-w-md space-y-8">
        <div class="text-center animate-fade-in-up">
          <div class="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
            <i class="pi pi-bolt text-2xl text-white"></i>
          </div>
          <h2 class="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome back
          </h2>
          <p class="text-slate-400 text-sm">
            Sign in to access your dashboard and chats.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6 animate-fade-in-up animate-delay-100">
          <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
            {{ error }}
          </div>

          <div class="space-y-4">
            <div>
              <label for="email" class="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 bg-[#1e293b] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="name@example.com"
              />
            </div>
            
            <div>
              <label for="password" class="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3 bg-[#1e293b] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                v-model="rememberMe"
                class="w-4 h-4 rounded border-slate-600 bg-[#1e293b] text-blue-600 focus:ring-blue-500 focus:ring-offset-[#0f172a]"
              >
              <span class="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
            </label>
            <a href="#" class="text-blue-500 hover:text-blue-400 font-medium transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Log in
          </button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-800"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-[#0f172a] text-slate-500">Or continue with</span>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <a 
            href="http://localhost:3000/api/auth/google"
            class="flex items-center justify-center w-12 h-12 bg-[#1e293b] hover:bg-[#2a3855] border border-slate-700 rounded-xl transition-all duration-200 hover:border-slate-600 group"
            title="Sign in with Google"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-6 h-6 group-hover:scale-110 transition-transform" alt="Google" />
          </a>
        </div>

        <p class="text-center text-sm text-slate-500 mt-8">
          Don't have an account? 
          <span class="text-slate-600 cursor-not-allowed">Contact Admin</span>
        </p>
      </div>
    </div>

    <!-- Right Side - Image -->
    <div class="hidden lg:block w-1/2 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-900/40 z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
        alt="Background" 
        class="w-full h-full object-cover"
      />
      <div class="absolute bottom-12 left-12 z-20 text-white max-w-md">
        <h3 class="text-2xl font-bold mb-2">Core Aphelion</h3>
        <p class="text-slate-200/80">Experience the next generation of AI-powered communication.</p>
      </div>
    </div>
  </div>
</template>
