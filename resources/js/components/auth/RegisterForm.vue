<script setup lang="ts">
import { fieldDescribedBy, fieldErrorId } from '@/composables/useForm';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton.vue';
import FormFieldError from '@/components/shared/FormFieldError.vue';
import type { FormState } from '@/types/forms';
import type { RegisterFormData } from '@/types/auth/forms';

defineProps<{ form: FormState<RegisterFormData> }>();
const emit = defineEmits<{ submit: [] }>();
</script>

<template>
    <FormFieldError
        v-if="form.formError && Object.keys(form.errors).length === 0"
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
                <label for="name">Name</label>
                <input
                    id="name"
                    v-model="form.data.name"
                    type="text"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="name"
                    name="name"
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
                    required
                    :tabindex="2"
                    autocomplete="email"
                    name="email"
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
                <label for="password">Password</label>
                <input
                    id="password"
                    v-model="form.data.password"
                    type="password"
                    required
                    :tabindex="3"
                    autocomplete="new-password"
                    name="password"
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

            <div class="grid gap-2">
                <label for="password_confirmation">Confirm password</label>
                <input
                    id="password_confirmation"
                    v-model="form.data.password_confirmation"
                    type="password"
                    required
                    :tabindex="4"
                    autocomplete="new-password"
                    name="password_confirmation"
                    placeholder="Confirm password"
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

            <AuthSubmitButton
                class="mt-2 w-full"
                label="Create account"
                :processing="form.processing"
                :tabindex="5"
                test-id="register-user-button"
            />
        </div>

        <div class="text-center text-sm text-neutral-600">
            Already have an account?
            <a href="/login" :tabindex="6">Log in</a>
        </div>
    </form>
</template>
