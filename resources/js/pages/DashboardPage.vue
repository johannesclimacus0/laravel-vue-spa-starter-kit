<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    document.title = 'Dashboard';
});
</script>

<template>
    <main class="mx-auto max-w-5xl px-4 py-8">
        <div class="space-y-4">
            <h1 class="text-2xl font-semibold">Dashboard</h1>
        </div>
    </main>
</template>
