<template>
  <div class="min-h-screen bg-[#09090b] flex items-center justify-center p-4 overflow-hidden relative selection:bg-red-500/30">
    <!-- Background Effects -->
    <div class="absolute inset-0 w-full h-full">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[128px] animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[128px] animate-pulse delay-700"></div>
    </div>
    
    <!-- Pattern Overlay -->
    <div class="absolute inset-0 opacity-[0.03]" 
         style="background-image: radial-gradient(#ef4444 1px, transparent 1px); background-size: 32px 32px;">
    </div>

    <!-- Content Container -->
    <div class="relative z-10 max-w-2xl w-full text-center">
      <!-- Error Code -->
      <h1 class="text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 select-none opacity-50 font-mono tracking-tighter">
        403
      </h1>
      
      <!-- Icon/Visual -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/30 shadow-[0_0_60px_-10px_rgba(239,68,68,0.3)]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <!-- Text Content -->
      <div class="space-y-6 mt-8 relative">
        <h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Acceso Restringido
        </h2>
        <p class="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
          Tus credenciales no tienen el nivel de autorización necesario para acceder a este sector del sistema.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button @click="goBack" 
                  class="group px-8 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all duration-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>
          
          <router-link to="/" 
                       class="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] transition-all duration-300">
            Ir al Dashboard
          </router-link>
        </div>
      </div>
      
      <!-- Footer ID -->
      <div class="mt-16 text-zinc-600 font-mono text-xs uppercase tracking-widest">
        SEC_PROT_ID: {{ Math.random().toString(36).substr(2, 9).toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/')
    }
}
</script>
