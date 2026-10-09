<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    document.title = 'Not found';
});
</script>

<template>
    <div
        class="flex min-h-svh flex-col items-center justify-center gap-4 bg-white p-6"
    >
        <h1 class="text-2xl font-medium">Page not found</h1>
        <a class="underline" href="/">Go home</a>
    </div>
</template>
