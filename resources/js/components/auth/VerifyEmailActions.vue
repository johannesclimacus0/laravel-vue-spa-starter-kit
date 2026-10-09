<script setup lang="ts">
import type { FormState } from '@/types/forms';
const props = defineProps<{ form: FormState<Record<string, never>> }>();
const emit = defineEmits<{ resend: []; logout: [] }>();
import AuthSubmitButton from '@/components/auth/AuthSubmitButton.vue';
</script>

<template>
    <div
        v-if="props.form.status === 'verification-link-sent'"
        class="mb-4 text-center text-sm font-medium text-green-600"
    >
        A new verification link has been sent to the email address you provided
        during registration.
    </div>

    <p
        v-if="props.form.formError"
        class="mb-4 text-center text-sm text-red-600"
        role="alert"
    >
        {{ props.form.formError }}
    </p>

    <div class="space-y-6 text-center">
        <AuthSubmitButton
            type="button"
            :processing="props.form.processing"
            label="Resend verification email"
            @click="emit('resend')"
        />

        <button
            type="button"
            class="mx-auto block text-sm text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!"
            @click="emit('logout')"
        >
            Log out
        </button>
    </div>
</template>
