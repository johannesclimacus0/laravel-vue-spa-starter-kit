<script setup lang="ts">
import { onMounted } from 'vue';
import { useForm } from '@/composables/useForm';
import { authService } from '@/services/auth/AuthService';
import { getPostAuthPath, historyStateFrom } from '@/lib/navigation';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = useForm({
    password: '',
});

const intended = getPostAuthPath(historyStateFrom(), '/settings/security');

async function onSubmit(): Promise<void> {
    try {
        await form.submit(async (data) => {
            await authService.confirmPassword({ password: data.password });
            form.reset('password');
            await router.replace(intended);
        });
    } catch {
        // Errors are mapped onto the form.
    }
}

onMounted(() => {
    document.title = 'Confirm password';
});
import AuthPageLayout from '@/layouts/auth/AuthPageLayout.vue';
import ConfirmPasswordForm from '@/components/auth/ConfirmPasswordForm.vue';
</script>

<template>
    <AuthPageLayout
        title="Confirm password"
        description="This is a secure area of the application. Please confirm your password before continuing."
    >
        <ConfirmPasswordForm :form="form" @submit="onSubmit" />
    </AuthPageLayout>
</template>
