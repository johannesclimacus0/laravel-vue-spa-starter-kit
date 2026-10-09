<script setup lang="ts">
defineProps<{ title: string; description: string }>();
</script>

<template>
    <main
        class="flex min-h-screen items-center justify-center bg-white px-4 py-8 text-neutral-900"
    >
        <section
            class="w-full max-w-sm space-y-6 border border-neutral-200 p-6"
        >
            <header class="space-y-2 text-center">
                <h1 class="text-xl font-semibold">{{ title }}</h1>
                <p class="text-sm text-neutral-600">{{ description }}</p>
            </header>
            <slot />
        </section>
    </main>
</template>
