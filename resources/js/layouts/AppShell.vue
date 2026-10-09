<script setup lang="ts">
import AuthSessionBridge from '@/auth/AuthSessionBridge.vue';
import { useAuthStore } from '@/stores/auth/index';
import { RouterView, useRoute, useRouter } from 'vue-router';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

async function handleLogout(): Promise<void> {
    try {
        await auth.logout();
    } finally {
        await router.replace('/login');
    }
}
</script>

<template>
    <main
        v-if="auth.isLoading"
        class="flex min-h-screen items-center justify-center bg-white"
        role="status"
        aria-live="polite"
        aria-busy="true"
    >
        <span class="text-sm text-neutral-600">Loading…</span>
    </main>
    <template v-else>
        <AuthSessionBridge />
        <header
            v-if="
                route.path.startsWith('/dashboard') ||
                route.path.startsWith('/settings')
            "
            class="border-b border-neutral-200 bg-white"
        >
            <div
                class="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3"
            >
                <nav aria-label="Main" class="flex gap-4 text-sm">
                    <a href="/dashboard">Dashboard</a>
                    <a href="/settings/profile">Settings</a>
                </nav>
                <div
                    v-if="auth.user"
                    class="ml-auto flex items-center gap-3 text-sm"
                >
                    <span>{{ auth.user.name }}</span>
                    <button type="button" @click="handleLogout">Log out</button>
                </div>
            </div>
        </header>
        <RouterView />
    </template>
</template>
