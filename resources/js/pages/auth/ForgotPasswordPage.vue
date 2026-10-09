<script setup lang="ts">
import { onMounted } from 'vue';
import { useForm } from '@/composables/useForm';
import { authService } from '@/services/auth/AuthService';

const form = useForm({
    email: '',
});

async function onSubmit(): Promise<void> {
    try {
        await form.submit(async (data) => {
            return await authService.requestPasswordReset(data.email);
        });
    } catch {
        // Errors are mapped onto the form.
    }
}

onMounted(() => {
    document.title = 'Forgot password';
});
import AuthPageLayout from '@/layouts/auth/AuthPageLayout.vue';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue';
</script>

<template>
    <AuthPageLayout
        title="Forgot password"
        description="Enter your email to receive a password reset link"
    >
        <ForgotPasswordForm :form="form" @submit="onSubmit" />
    </AuthPageLayout>
</template>
