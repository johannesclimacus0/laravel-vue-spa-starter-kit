<script setup lang="ts">
defineProps<{ message: string; id?: string }>();
</script>

<template>
    <p :id="id" class="text-sm text-red-600" role="alert">{{ message }}</p>
</template>
