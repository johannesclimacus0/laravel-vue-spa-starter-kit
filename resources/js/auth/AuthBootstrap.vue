<script setup lang="ts">
import { useAuthStore } from '@/stores/auth/index';
import { onMounted, onUnmounted } from 'vue';

const auth = useAuthStore();
let stopBootstrap: (() => void) | undefined;

onMounted(() => {
    stopBootstrap = auth.startBootstrap();
});

onUnmounted(() => {
    stopBootstrap?.();
});
</script>

<template>
    <slot />
</template>
