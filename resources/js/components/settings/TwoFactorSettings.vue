<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from '@/composables/useForm';
import { useTwoFactorAuth } from '@/composables/auth/useTwoFactorAuth';
import { normalizeApiError } from '@/http/http';
import { locationToPath } from '@/lib/navigation';
import { navigateToConfirmPasswordIfRequired } from '@/http/auth/password-confirmation';
import { twoFactorService } from '@/services/auth/TwoFactorService';
import type { SecuritySettings } from '@/types/settings/security';
import FormFieldError from '@/components/shared/FormFieldError.vue';

const props = defineProps<{ settings: SecuritySettings }>();
const emit = defineEmits<{ 'settings-changed': [] }>();
const router = useRouter();
const route = useRoute();
const twoFactor = useTwoFactorAuth();
const codeForm = useForm({ code: '' });
const showSetup = ref(false);
const showRecoveryCodes = ref(false);
const processing = ref(false);
const actionError = ref<string | null>(null);

function redirectIfConfirmationRequired(error: unknown): boolean {
    return navigateToConfirmPasswordIfRequired(
        error,
        router,
        locationToPath(route),
    );
}

async function startSetup(): Promise<void> {
    if (processing.value) return;
    processing.value = true;
    actionError.value = null;

    try {
        await twoFactorService.enableTwoFactor();
        await twoFactor.fetchSetupData();
        showSetup.value = true;
    } catch (error) {
        if (!redirectIfConfirmationRequired(error)) {
            actionError.value = normalizeApiError(error).message;
        }
    } finally {
        processing.value = false;
    }
}

async function confirmSetup(): Promise<void> {
    try {
        await codeForm.submit(async (data) => {
            await twoFactorService.confirmTwoFactor({ code: data.code });
            twoFactor.clearSetupData();
            showSetup.value = false;
            codeForm.reset();
            emit('settings-changed');
        });
    } catch (error) {
        if (!redirectIfConfirmationRequired(error)) {
            codeForm.setField('code', '');
        }
    }
}

async function turnOff(): Promise<void> {
    if (processing.value) return;
    processing.value = true;
    actionError.value = null;

    try {
        await twoFactorService.disableTwoFactor();
        twoFactor.clearTwoFactorAuthData();
        showRecoveryCodes.value = false;
        emit('settings-changed');
    } catch (error) {
        if (!redirectIfConfirmationRequired(error)) {
            actionError.value = normalizeApiError(error).message;
        }
    } finally {
        processing.value = false;
    }
}

async function toggleRecoveryCodes(): Promise<void> {
    showRecoveryCodes.value = !showRecoveryCodes.value;
    if (showRecoveryCodes.value && !twoFactor.recoveryCodesList.value.length) {
        await twoFactor.fetchRecoveryCodes();
    }
}

async function refreshRecoveryCodes(): Promise<void> {
    if (processing.value) return;
    processing.value = true;
    actionError.value = null;

    try {
        await twoFactorService.regenerateRecoveryCodes();
        await twoFactor.fetchRecoveryCodes();
        showRecoveryCodes.value = true;
    } catch (error) {
        if (!redirectIfConfirmationRequired(error)) {
            actionError.value = normalizeApiError(error).message;
        }
    } finally {
        processing.value = false;
    }
}

async function finishSetup(): Promise<void> {
    showSetup.value = false;
    twoFactor.clearSetupData();
    emit('settings-changed');
}

function cancelSetup(): void {
    showSetup.value = false;
    twoFactor.clearSetupData();
}

onUnmounted(() => twoFactor.clearTwoFactorAuthData());
</script>

<template>
    <section
        v-if="props.settings.canManageTwoFactor"
        class="space-y-4 border-t border-neutral-200 pt-6"
    >
        <header>
            <h2 class="text-lg font-semibold">Two-factor authentication</h2>
            <p class="text-sm text-neutral-600">
                Add a code from an authenticator app when you sign in.
            </p>
        </header>
        <FormFieldError v-if="actionError" :message="actionError" />
        <template v-if="props.settings.twoFactorEnabled">
            <button type="button" :disabled="processing" @click="turnOff">
                Disable 2FA
            </button>
            <button
                type="button"
                :disabled="processing"
                @click="toggleRecoveryCodes"
            >
                {{ showRecoveryCodes ? 'Hide' : 'View' }} recovery codes
            </button>
            <button
                v-if="showRecoveryCodes"
                type="button"
                :disabled="processing"
                @click="refreshRecoveryCodes"
            >
                Regenerate codes
            </button>
            <ul
                v-if="showRecoveryCodes"
                class="space-y-1 border border-neutral-200 p-4 font-mono text-sm"
            >
                <li
                    v-for="code in twoFactor.recoveryCodesList.value"
                    :key="code"
                >
                    {{ code }}
                </li>
            </ul>
            <div v-if="twoFactor.errors.value.length">
                <FormFieldError
                    v-for="error in twoFactor.errors.value"
                    :key="error"
                    :message="error"
                />
            </div>
        </template>
        <template v-else>
            <button type="button" :disabled="processing" @click="startSetup">
                Enable 2FA
            </button>
            <div
                v-if="showSetup"
                class="space-y-4 border border-neutral-200 p-4"
            >
                <div v-if="twoFactor.errors.value.length">
                    <FormFieldError
                        v-for="error in twoFactor.errors.value"
                        :key="error"
                        :message="error"
                    />
                </div>
                <div
                    v-if="twoFactor.qrCodeSvg.value"
                    v-html="twoFactor.qrCodeSvg.value"
                    class="max-w-56"
                />
                <p>
                    Setup key:
                    <code>{{ twoFactor.manualSetupKey.value }}</code>
                </p>
                <form
                    v-if="props.settings.requiresConfirmation"
                    class="space-y-3"
                    @submit.prevent="confirmSetup"
                >
                    <label for="two-factor-code">Authenticator code</label>
                    <input
                        id="two-factor-code"
                        v-model="codeForm.data.code"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="6"
                        autocomplete="one-time-code"
                        required
                    />
                    <FormFieldError
                        v-if="codeForm.errors.code || codeForm.formError"
                        :message="
                            codeForm.errors.code ?? codeForm.formError ?? ''
                        "
                    />
                    <button type="submit" :disabled="codeForm.processing">
                        Confirm 2FA
                    </button>
                </form>
                <button
                    v-if="props.settings.requiresConfirmation"
                    type="button"
                    @click="cancelSetup"
                >
                    Cancel
                </button>
                <button v-else type="button" @click="finishSetup">Done</button>
            </div>
        </template>
    </section>
</template>
