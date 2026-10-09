<script setup lang="ts">
import { onMounted } from 'vue';
import { useForm } from '@/composables/useForm';
import { authService } from '@/services/auth/AuthService';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const token = computed(() => String(route.params.token ?? ''));
const emailFromQuery = computed(() => {
    const value = route.query.email;

    return typeof value === 'string' ? value : '';
});

const form = useForm({
    email: emailFromQuery.value,
    password: '',
    password_confirmation: '',
});

watch(
    emailFromQuery,
    (value) => {
        if (value.length > 0) {
            form.data.email = value;
        }
    },
    { immediate: true },
);

async function onSubmit(): Promise<void> {
    try {
        await form.submit(async (data) => {
            const status = await authService.resetPassword({
                token: token.value,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });

            form.reset('password', 'password_confirmation');

            await router.replace({
                path: '/login',
                state: { status },
            });
        });
    } catch {
        // Errors are mapped onto the form.
    }
}

onMounted(() => {
    document.title = 'Reset password';
});
import AuthPageLayout from '@/layouts/auth/AuthPageLayout.vue';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue';
</script>

<template>
    <AuthPageLayout
        title="Reset password"
        description="Please enter your new password below"
    >
        <ResetPasswordForm :form="form" @submit="onSubmit" />
    </AuthPageLayout>
</template>
