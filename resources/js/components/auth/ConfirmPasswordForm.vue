<script setup lang="ts">
import { fieldDescribedBy, fieldErrorId } from '@/composables/useForm';
import type { FormState } from '@/types/forms';
const props = defineProps<{ form: FormState<{ password: string }> }>();
const emit = defineEmits<{ submit: [] }>();
import AuthSubmitButton from '@/components/auth/AuthSubmitButton.vue';
</script>

<template>
    <form novalidate @submit.prevent="emit('submit')">
        <div class="space-y-6">
            <div class="grid gap-2">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    v-model="props.form.data.password"
                    name="password"
                    class="block w-full"
                    required
                    autocomplete="current-password"
                    autofocus
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

            <div class="flex items-center">
                <AuthSubmitButton
                    class="w-full"
                    :processing="props.form.processing"
                    test-id="confirm-password-button"
                    label="Confirm password"
                />
            </div>
        </div>
    </form>
</template>
