<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { fieldDescribedBy, fieldErrorId, useForm } from '@/composables/useForm';
import { normalizeApiError } from '@/http/http';
import { settingsService } from '@/services/settings/SettingsService';
import FormFieldError from '@/components/shared/FormFieldError.vue';
import FormStatusMessage from '@/components/shared/FormStatusMessage.vue';

const props = defineProps<{ passwordRules: string }>();
const currentPasswordInput = useTemplateRef<HTMLInputElement>(
    'currentPasswordInput',
);
const passwordInput = useTemplateRef<HTMLInputElement>('passwordInput');
const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});
const serverError = ref<string | null>(null);

async function onSubmit(): Promise<void> {
    serverError.value = null;
    try {
        await form.submit(async (data) => {
            await settingsService.updatePassword(data);
            form.reset();

            return 'Password updated.';
        });
    } catch (error: unknown) {
        const { errors } = normalizeApiError(error);

        if (errors.password) {
            form.reset('password', 'password_confirmation');
            passwordInput.value?.focus();
        }

        if (errors.current_password) {
            form.reset('current_password');
            currentPasswordInput.value?.focus();
        }

        if (!Object.keys(errors).length) {
            serverError.value = normalizeApiError(error).message;
        }
    }
}
</script>

<template>
    <section class="space-y-6">
        <header>
            <h2 class="text-lg font-semibold">Update password</h2>
            <p class="text-sm text-neutral-600">
                Use a long, random password to help keep your account secure.
            </p>
        </header>

        <form class="space-y-6" novalidate @submit.prevent="onSubmit">
            <div class="grid gap-2">
                <label for="current_password">Current password</label>
                <input
                    id="current_password"
                    ref="currentPasswordInput"
                    v-model="form.data.current_password"
                    type="password"
                    name="current_password"
                    class="block w-full"
                    autocomplete="current-password"
                    placeholder="Current password"
                    :aria-invalid="Boolean(form.errors.current_password)"
                    :aria-describedby="
                        fieldDescribedBy('current_password', form.errors)
                    "
                    :disabled="form.processing"
                />
                <FormFieldError
                    v-if="form.errors.current_password"
                    :id="fieldErrorId('current_password')"
                    :message="form.errors.current_password"
                />
            </div>

            <div class="grid gap-2">
                <label for="password">New password</label>
                <input
                    id="password"
                    ref="passwordInput"
                    v-model="form.data.password"
                    type="password"
                    name="password"
                    class="block w-full"
                    autocomplete="new-password"
                    placeholder="New password"
                    :passwordrules="props.passwordRules"
                    :aria-invalid="Boolean(form.errors.password)"
                    :aria-describedby="
                        fieldDescribedBy('password', form.errors)
                    "
                    :disabled="form.processing"
                />
                <FormFieldError
                    v-if="form.errors.password"
                    :id="fieldErrorId('password')"
                    :message="form.errors.password"
                />
            </div>

            <div class="grid gap-2">
                <label for="password_confirmation">Confirm password</label>
                <input
                    id="password_confirmation"
                    v-model="form.data.password_confirmation"
                    type="password"
                    name="password_confirmation"
                    class="block w-full"
                    autocomplete="new-password"
                    placeholder="Confirm password"
                    :passwordrules="props.passwordRules"
                    :aria-invalid="Boolean(form.errors.password_confirmation)"
                    :aria-describedby="
                        fieldDescribedBy('password_confirmation', form.errors)
                    "
                    :disabled="form.processing"
                />
                <FormFieldError
                    v-if="form.errors.password_confirmation"
                    :id="fieldErrorId('password_confirmation')"
                    :message="form.errors.password_confirmation"
                />
            </div>

            <FormFieldError
                v-if="
                    serverError ||
                    (form.formError &&
                        !form.errors.current_password &&
                        !form.errors.password &&
                        !form.errors.password_confirmation)
                "
                :message="serverError ?? form.formError ?? ''"
            />
            <div class="flex items-center gap-4">
                <button
                    type="submit"
                    :disabled="form.processing"
                    data-test="update-password-button"
                >
                    Save
                </button>
                <FormStatusMessage v-if="form.status" :message="form.status" />
            </div>
        </form>
    </section>
</template>
