<script setup lang="ts">
import { useAuthStore } from '@/stores/auth/index';
import { getPostAuthPath } from '@/lib/navigation';
import { watchEffect } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

function historyFrom(): unknown {
    return (window.history.state as { from?: string } | null)?.from;
}

watchEffect(() => {
    if (auth.isLoading) {
        return;
    }

    if (!auth.isAuthenticated) {
        return;
    }

    if (!auth.isVerified) {
        void router.replace('/verify-email');

        return;
    }

    void router.replace(getPostAuthPath(historyFrom(), '/dashboard'));
});
</script>

<template>
    <RouterView v-if="!auth.isLoading && !auth.isAuthenticated" />
</template>
