<template>
  <div class="min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden relative">
    <!-- Particles Background -->
    <ParticlesBackground 
      :particleCount="80"
      particleColor="rgba(99, 102, 241, 0.5)"
      connectionColor="rgba(99, 102, 241, 0.15)"
      class="opacity-60"
    />

    <!-- Planet/Orb Effect -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 blur-3xl"></div>

    <!-- Content -->
    <div class="relative z-10 max-w-3xl w-full text-center">
      
      <!-- Glitchy 404 -->
      <div class="relative inline-block">
        <h1 class="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-t from-gray-500 to-white opacity-80 font-mono tracking-tighter mix-blend-overlay">
          404
        </h1>
        <div class="absolute inset-0 text-9xl md:text-[12rem] font-black text-indigo-500 opacity-20 blur-sm font-mono tracking-tighter animate-pulse">
          404
        </div>
      </div>

      <div class="space-y-6 z-20 mt-4 relative backdrop-blur-sm p-8 rounded-3xl border border-white/5 bg-white/5">
        <h2 class="text-2xl md:text-3xl font-light text-white tracking-[0.2em] uppercase">
          Señal Perdida
        </h2>
        
        <p class="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed font-light">
          La página que buscas ha derivado fuera de los parámetros operativos de Aphelion. No existe en este sector.
        </p>

        <div class="h-px w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto my-8 opacity-50"></div>

        <router-link to="/" 
          class="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          <span class="text-white font-medium tracking-wide">Regresar a Base</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import ParticlesBackground from '../components/ParticlesBackground.vue'
</script>
