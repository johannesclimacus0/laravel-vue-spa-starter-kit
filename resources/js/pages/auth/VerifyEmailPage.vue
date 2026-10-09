<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth/index';
import { useForm } from '@/composables/useForm';
import { authService } from '@/services/auth/AuthService';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const form = useForm({});

watchEffect(() => {
    if (auth.isVerified) {
        void router.replace('/dashboard');
    }
});

async function onResend(): Promise<void> {
    try {
        await form.submit(async () => {
            return await authService.resendVerificationEmail();
        });
    } catch {
        // Errors are mapped onto the form.
    }
}

async function onLogout(): Promise<void> {
    await auth.logout();
    await router.replace('/login');
}

onMounted(() => {
    document.title = 'Email verification';
});
import AuthPageLayout from '@/layouts/auth/AuthPageLayout.vue';
import VerifyEmailActions from '@/components/auth/VerifyEmailActions.vue';
</script>

<template>
    <AuthPageLayout
        title="Email verification"
        description="Please verify your email address by clicking on the link we just emailed to you."
    >
        <VerifyEmailActions
            :form="form"
            @resend="onResend"
            @logout="onLogout"
        />
    </AuthPageLayout>
</template>
