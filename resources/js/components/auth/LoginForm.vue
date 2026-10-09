<script setup lang="ts">
import { fieldDescribedBy, fieldErrorId } from '@/composables/useForm';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton.vue';
import FormFieldError from '@/components/shared/FormFieldError.vue';
import type { FormState } from '@/types/forms';
import type { LoginFormData } from '@/types/auth/forms';

const props = withDefaults(
    defineProps<{
        flashStatus?: string | null;
        canResetPassword?: boolean;
        canRegister?: boolean;
        form: FormState<LoginFormData>;
    }>(),
    { flashStatus: null, canResetPassword: true, canRegister: true },
);

const emit = defineEmits<{ submit: [] }>();

function onRememberChange(event: Event): void {
    props.form.setField(
        'remember',
        (event.currentTarget as HTMLInputElement).checked,
    );
}
</script>

<template>
    <div
        v-if="flashStatus || form.status"
        class="mb-4 text-center text-sm font-medium text-green-600"
    >
        {{ flashStatus ?? form.status }}
    </div>

    <FormFieldError
        v-if="form.formError && !form.errors.email && !form.errors.password"
        class="mb-4 text-center"
        :message="form.formError"
    />

    <form
        class="flex flex-col gap-6"
        novalidate
        @submit.prevent="emit('submit')"
    >
        <div class="grid gap-6">
            <div class="grid gap-2">
                <label for="email">Email address</label>
                <input
                    id="email"
                    v-model="form.data.email"
                    type="email"
                    name="email"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="email"
                    placeholder="email@example.com"
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

            <div class="grid gap-2">
                <div class="flex items-center">
                    <label for="password">Password</label>
                    <a
                        v-if="canResetPassword"
                        href="/forgot-password"
                        class="ml-auto text-sm"
                        :tabindex="5"
                    >
                        Forgot your password?
                    </a>
                </div>
                <input
                    id="password"
                    v-model="form.data.password"
                    type="password"
                    name="password"
                    required
                    :tabindex="2"
                    autocomplete="current-password"
                    placeholder="Password"
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

            <div class="flex items-center justify-between">
                <label for="remember" class="flex items-center space-x-3">
                    <input
                        id="remember"
                        type="checkbox"
                        :checked="form.data.remember"
                        :tabindex="3"
                        :disabled="form.processing"
                        @change="onRememberChange"
                    />
                    <span>Remember me</span>
                </label>
            </div>

            <AuthSubmitButton
                class="mt-4 w-full"
                label="Log in"
                :processing="form.processing"
                :tabindex="4"
                test-id="login-button"
            />
        </div>

        <div v-if="canRegister" class="text-center text-sm text-neutral-600">
            Don't have an account?
            <a href="/register" :tabindex="5">Sign up</a>
        </div>
    </form>
</template>
