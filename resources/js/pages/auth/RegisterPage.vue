<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth/index';
import { useRouter } from 'vue-router';
import RegisterForm from '@/components/auth/RegisterForm.vue';
import { useForm } from '@/composables/useForm';
import { authService } from '@/services/auth/AuthService';
import type { RegisterFormData } from '@/types/auth/forms';

const auth = useAuthStore();
const router = useRouter();
const form = useForm<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

async function onSubmit(): Promise<void> {
    try {
        await form.submit(async (data) => {
            await authService.register(data);
            form.reset('password', 'password_confirmation');
            const user = await auth.refreshUser();

            if (user && user.email_verified_at === null) {
                await router.replace('/verify-email');

                return;
            }

            await router.replace('/dashboard');
        });
    } catch {
        // Errors are mapped onto the form.
    }
}

onMounted(() => {
    document.title = 'Create an account';
});
import AuthPageLayout from '@/layouts/auth/AuthPageLayout.vue';
</script>

<template>
    <AuthPageLayout
        title="Create an account"
        description="Enter your details below to create your account"
    >
        <RegisterForm :form="form" @submit="onSubmit" />
    </AuthPageLayout>
</template>
