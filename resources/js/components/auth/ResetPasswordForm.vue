<script setup lang="ts">
import { fieldDescribedBy, fieldErrorId } from '@/composables/useForm';
import type { FormState } from '@/types/forms';
import type { ResetPasswordFormData } from '@/types/auth/forms';
const props = defineProps<{ form: FormState<ResetPasswordFormData> }>();
const emit = defineEmits<{ submit: [] }>();
import AuthSubmitButton from '@/components/auth/AuthSubmitButton.vue';
</script>

<template>
    <form novalidate @submit.prevent="emit('submit')">
        <div class="grid gap-6">
            <div class="grid gap-2">
                <label for="email">Email</label>
                <input
                    id="email"
                    v-model="props.form.data.email"
                    type="email"
                    name="email"
                    autocomplete="email"
                    readonly
                    class="block w-full"
                    :aria-invalid="Boolean(props.form.errors.email)"
                    :aria-describedby="
                        fieldDescribedBy('email', props.form.errors)
                    "
                    :disabled="props.form.processing"
                />
                <p
                    v-if="props.form.errors.email"
                    :id="fieldErrorId('email')"
                    class="text-sm text-red-600"
                    role="alert"
                >
                    {{ props.form.errors.email }}
                </p>
            </div>

            <div class="grid gap-2">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    v-model="props.form.data.password"
                    name="password"
                    autocomplete="new-password"
                    class="block w-full"
                    autofocus
                    placeholder="Password"
                    :aria-invalid="Boolean(props.form.errors.password)"
                    :aria-describedby="
                        fieldDescribedBy('password', props.form.errors)
                    "
                    :disabled="props.form.processing"
                />
                <p
                    v-if="props.form.errors.password"
                    :id="fieldErrorId('password')"
                    class="text-sm text-red-600"
                    role="alert"
                >
                    {{ props.form.errors.password }}
                </p>
            </div>

            <div class="grid gap-2">
                <label for="password_confirmation">Confirm password</label>
                <input
                    type="password"
                    id="password_confirmation"
                    v-model="props.form.data.password_confirmation"
                    name="password_confirmation"
                    autocomplete="new-password"
                    class="block w-full"
                    placeholder="Confirm password"
                    :aria-invalid="
                        Boolean(props.form.errors.password_confirmation)
                    "
                    :aria-describedby="
                        fieldDescribedBy(
                            'password_confirmation',
                            props.form.errors,
                        )
                    "
                    :disabled="props.form.processing"
                />
                <p
                    v-if="props.form.errors.password_confirmation"
                    :id="fieldErrorId('password_confirmation')"
                    class="text-sm text-red-600"
                    role="alert"
                >
                    {{ props.form.errors.password_confirmation }}
                </p>
            </div>

            <AuthSubmitButton
                class="mt-4 w-full"
                :processing="props.form.processing"
                test-id="reset-password-button"
                label="Reset password"
            />
        </div>
    </form>
</template>
