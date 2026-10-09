<script setup lang="ts">
import { ref } from 'vue';
import { fieldDescribedBy, fieldErrorId, useForm } from '@/composables/useForm';
import { authService } from '@/services/auth/AuthService';
import { settingsService } from '@/services/settings/SettingsService';
import type { User } from '@/types/auth';
import FormFieldError from '@/components/shared/FormFieldError.vue';
import FormStatusMessage from '@/components/shared/FormStatusMessage.vue';

const props = defineProps<{ user: User | null }>();
const emit = defineEmits<{ saved: [] }>();
const verificationStatus = ref<string | null>(null);
const form = useForm({
    name: props.user?.name ?? '',
    email: props.user?.email ?? '',
});

async function onSubmit(): Promise<void> {
    try {
        await form.submit(async (data) => {
            await settingsService.updateProfile(data);
            emit('saved');

            return 'Profile updated.';
        });
    } catch {
        // Errors are mapped onto the form.
    }
}

async function onResendVerification(): Promise<void> {
    try {
        verificationStatus.value = await authService.resendVerificationEmail();
    } catch {
        // Keep the profile form usable if the resend request fails.
    }
}
</script>

<template>
    <section class="space-y-6">
        <header>
            <h2 class="text-lg font-semibold">Profile</h2>
            <p class="text-sm text-neutral-600">
                Update your name and email address
            </p>
        </header>

        <form class="space-y-6" novalidate @submit.prevent="onSubmit">
            <div class="grid gap-2">
                <label for="name">Name</label>
                <input
                    id="name"
                    v-model="form.data.name"
                    name="name"
                    class="block w-full"
                    required
                    autocomplete="name"
                    placeholder="Full name"
                    :aria-invalid="Boolean(form.errors.name)"
                    :aria-describedby="fieldDescribedBy('name', form.errors)"
                    :disabled="form.processing"
                />
                <FormFieldError
                    v-if="form.errors.name"
                    :id="fieldErrorId('name')"
                    :message="form.errors.name"
                />
            </div>

            <div class="grid gap-2">
                <label for="email">Email address</label>
                <input
                    id="email"
                    v-model="form.data.email"
                    type="email"
                    name="email"
                    class="block w-full"
                    required
                    autocomplete="username"
                    placeholder="Email address"
                    :aria-invalid="Boolean(form.errors.email)"
                    :aria-describedby="fieldDescribedBy('email', form.errors)"
                    :disabled="form.processing"
                />
                <FormFieldError
                    v-if="form.errors.email"
                    :id="fieldErrorId('email')"
                    :message="form.errors.email"
                />
            </div>

            <div v-if="props.user && props.user.email_verified_at === null">
                <p class="-mt-4 text-sm text-neutral-600">
                    Your email address is unverified.
                    <button
                        type="button"
                        class="cursor-pointer text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!"
                        @click="onResendVerification"
                    >
                        Click here to re-send the verification email.
                    </button>
                </p>
                <p
                    v-if="verificationStatus === 'verification-link-sent'"
                    class="mt-2 text-sm font-medium text-green-600"
                    role="status"
                    aria-live="polite"
                >
                    A new verification link has been sent to your email address.
                </p>
            </div>

            <FormFieldError
                v-if="form.formError && !form.errors.name && !form.errors.email"
                :message="form.formError"
            />

            <div class="flex items-center gap-4">
                <button
                    type="submit"
                    :disabled="form.processing"
                    data-test="update-profile-button"
                >
                    Save
                </button>
                <FormStatusMessage v-if="form.status" :message="form.status" />
            </div>
        </form>
    </section>
</template>
