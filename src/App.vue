<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

const route = useRoute();

const layout = computed(() => {
    return route.meta.layout === 'MainLayout' ? MainLayout : 'div';
});
</script>

<template>
  <component :is="layout">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </component>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
