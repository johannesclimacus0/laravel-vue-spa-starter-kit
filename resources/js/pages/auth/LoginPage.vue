<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth/index';
import {
    getPostAuthPath,
    historyStateFrom,
    historyStateStatus,
} from '@/lib/navigation';
import { useRouter } from 'vue-router';
import LoginForm from '@/components/auth/LoginForm.vue';
import { useForm } from '@/composables/useForm';
import { authService } from '@/services/auth/AuthService';
import type { LoginFormData } from '@/types/auth/forms';

const auth = useAuthStore();
const router = useRouter();
const flashStatus = historyStateStatus() ?? null;
const intended = getPostAuthPath(historyStateFrom(), '/dashboard');
const form = useForm<LoginFormData>({
    email: '',
    password: '',
    remember: false,
});

async function onSubmit(): Promise<void> {
    try {
        await form.submit(async (data) => {
            const result = await authService.login(data);

            if (result.two_factor) {
                await router.replace({
                    path: '/two-factor-challenge',
                    state: { from: intended },
                });

                return;
            }

            form.reset('password');
            const user = await auth.refreshUser();

            if (user && user.email_verified_at === null) {
                await router.replace('/verify-email');

                return;
            }

            await router.replace(intended);
        });
    } catch {
        // Errors are mapped onto the form.
    }
}

onMounted(() => {
    document.title = 'Log in to your account';
});
import AuthPageLayout from '@/layouts/auth/AuthPageLayout.vue';
</script>

<template>
    <AuthPageLayout
        title="Log in to your account"
        description="Enter your email and password below to log in"
    >
        <LoginForm
            :form="form"
            :flash-status="flashStatus"
            @submit="onSubmit"
        />
    </AuthPageLayout>
</template>
