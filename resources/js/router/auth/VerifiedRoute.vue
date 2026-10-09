<script setup lang="ts">
import { useAuthStore } from '@/stores/auth/index';
import { locationToPath } from '@/lib/navigation';
import { watchEffect } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

watchEffect(() => {
    if (auth.isLoading) {
        return;
    }

    if (!auth.isAuthenticated) {
        void router.replace({
            path: '/login',
            state: { from: locationToPath(route) },
        });

        return;
    }

    if (!auth.isVerified) {
        void router.replace('/verify-email');
    }
});
</script>

<template>
    <RouterView
        v-if="!auth.isLoading && auth.isAuthenticated && auth.isVerified"
    />
</template>
