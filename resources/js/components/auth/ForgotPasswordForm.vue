<script setup lang="ts">
import { fieldDescribedBy, fieldErrorId } from '@/composables/useForm';
import type { FormState } from '@/types/forms';
const props = defineProps<{ form: FormState<{ email: string }> }>();
const emit = defineEmits<{ submit: [] }>();
import AuthSubmitButton from '@/components/auth/AuthSubmitButton.vue';
</script>

<template>
    <div
        v-if="props.form.status"
        class="mb-4 text-center text-sm font-medium text-green-600"
    >
        {{ props.form.status }}
    </div>

    <div class="space-y-6">
        <form novalidate @submit.prevent="emit('submit')">
            <div class="grid gap-2">
                <label for="email">Email address</label>
                <input
                    id="email"
                    v-model="props.form.data.email"
                    type="email"
                    name="email"
                    autocomplete="off"
                    autofocus
                    placeholder="email@example.com"
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

            <div class="my-6 flex items-center justify-start">
                <AuthSubmitButton
                    class="w-full"
                    :processing="props.form.processing"
                    test-id="email-password-reset-link-button"
                    label="Email password reset link"
                />
            </div>
        </form>

        <div class="space-x-1 text-center text-sm text-neutral-600">
            <span>Or, return to</span>
            <a href="/login">log in</a>
        </div>
    </div>
</template>
