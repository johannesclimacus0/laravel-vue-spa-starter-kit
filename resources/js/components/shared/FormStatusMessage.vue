<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<template>
    <p class="text-sm text-neutral-600" role="status" aria-live="polite">
        {{ message }}
    </p>
</template>
