<script setup lang="ts">
import { useAuthStore } from '@/stores/auth/index';
import { useForm } from '@/composables/useForm';
import { authService } from '@/services/auth/AuthService';
import { getPostAuthPath, historyStateFrom } from '@/lib/navigation';
import type { TwoFactorConfigContent } from '@/types/auth/two-factor';
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const showRecoveryInput = ref(false);
const code = ref('');

const form = useForm({
    recovery_code: '',
});

const intended = getPostAuthPath(historyStateFrom(), '/dashboard');

const authConfigContent = computed<TwoFactorConfigContent>(() => {
    if (showRecoveryInput.value) {
        return {
            title: 'Recovery code',
            description:
                'Please confirm access to your account by entering one of your emergency recovery codes.',
            buttonText: 'login using an authentication code',
        };
    }

    return {
        title: 'Authentication code',
        description:
            'Enter the authentication code provided by your authenticator application.',
        buttonText: 'login using a recovery code',
    };
});

function toggleRecoveryMode(): void {
    showRecoveryInput.value = !showRecoveryInput.value;
    form.clearErrors();
    code.value = '';
    form.reset('recovery_code');
}

async function onSubmitCode(): Promise<void> {
    try {
        await form.submit(async () => {
            await authService.submitTwoFactorChallenge({ code: code.value });
            code.value = '';

            const user = await auth.refreshUser();

            if (user && user.email_verified_at === null) {
                await router.replace('/verify-email');

                return;
            }

            await router.replace(intended);
        });
    } catch {
        code.value = '';
    }
}

async function onSubmitRecovery(): Promise<void> {
    try {
        await form.submit(async (data) => {
            await authService.submitTwoFactorChallenge({
                recovery_code: data.recovery_code,
            });
            form.reset('recovery_code');

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

watchEffect(() => {
    document.title = authConfigContent.value.title;
});
import AuthPageLayout from '@/layouts/auth/AuthPageLayout.vue';
import TwoFactorChallengeForm from '@/components/auth/TwoFactorChallengeForm.vue';
</script>

<template>
    <AuthPageLayout
        :title="authConfigContent.title"
        :description="authConfigContent.description"
    >
        <TwoFactorChallengeForm
            :form="form"
            v-model:code="code"
            :show-recovery-input="showRecoveryInput"
            :auth-config-content="authConfigContent"
            @submit-code="onSubmitCode"
            @submit-recovery="onSubmitRecovery"
            @toggle-recovery="toggleRecoveryMode"
        />
    </AuthPageLayout>
</template>
