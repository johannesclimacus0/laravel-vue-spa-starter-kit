<script setup lang="ts">
import { fieldDescribedBy, fieldErrorId } from '@/composables/useForm';
import type { FormState } from '@/types/forms';
import type { TwoFactorChallengeFormData } from '@/types/auth/forms';
import type { TwoFactorConfigContent } from '@/types/auth/two-factor';
const props = defineProps<{
    form: FormState<TwoFactorChallengeFormData>;
    showRecoveryInput: boolean;
    authConfigContent: TwoFactorConfigContent;
}>();
const code = defineModel<string>('code', { required: true });
const emit = defineEmits<{
    submitCode: [];
    submitRecovery: [];
    toggleRecovery: [];
}>();
import AuthSubmitButton from '@/components/auth/AuthSubmitButton.vue';
</script>

<template>
    <div class="space-y-6">
        <template v-if="!showRecoveryInput">
            <form
                class="space-y-4"
                novalidate
                @submit.prevent="emit('submitCode')"
            >
                <div
                    class="flex flex-col items-center justify-center space-y-3 text-center"
                >
                    <div class="flex w-full items-center justify-center">
                        <input
                            id="otp"
                            v-model="code"
                            type="text"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            maxlength="6"
                            autocomplete="one-time-code"
                            :disabled="props.form.processing"
                            autofocus
                            :aria-invalid="Boolean(props.form.errors.code)"
                            :aria-describedby="
                                fieldDescribedBy('code', props.form.errors)
                            "
                        />
                    </div>
                    <p
                        v-if="props.form.errors.code"
                        :id="fieldErrorId('code')"
                        class="text-sm text-red-600"
                        role="alert"
                    >
                        {{ props.form.errors.code }}
                    </p>
                </div>
                <AuthSubmitButton
                    class="w-full"
                    :processing="props.form.processing"
                    :disabled="code.length < 6"
                    label="Continue"
                />
                <div class="text-center text-sm text-neutral-600">
                    <span>or you can </span>
                    <button
                        type="button"
                        class="text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!"
                        @click="emit('toggleRecovery')"
                    >
                        {{ authConfigContent.buttonText }}
                    </button>
                </div>
            </form>
        </template>

        <template v-else>
            <form
                class="space-y-4"
                novalidate
                @submit.prevent="emit('submitRecovery')"
            >
                <div class="grid gap-2">
                    <label for="recovery_code">Recovery code</label>
                    <input
                        id="recovery_code"
                        v-model="props.form.data.recovery_code"
                        name="recovery_code"
                        type="text"
                        placeholder="Enter recovery code"
                        autofocus
                        required
                        :aria-invalid="Boolean(props.form.errors.recovery_code)"
                        :aria-describedby="
                            fieldDescribedBy('recovery_code', props.form.errors)
                        "
                        :disabled="props.form.processing"
                    />
                    <p
                        v-if="props.form.errors.recovery_code"
                        :id="fieldErrorId('recovery_code')"
                        class="text-sm text-red-600"
                        role="alert"
                    >
                        {{ props.form.errors.recovery_code }}
                    </p>
                </div>
                <AuthSubmitButton
                    class="w-full"
                    :processing="props.form.processing"
                    label="Continue"
                />

                <div class="text-center text-sm text-neutral-600">
                    <span>or you can </span>
                    <button
                        type="button"
                        class="text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current!"
                        @click="emit('toggleRecovery')"
                    >
                        {{ authConfigContent.buttonText }}
                    </button>
                </div>
            </form>
        </template>
    </div>
</template>
