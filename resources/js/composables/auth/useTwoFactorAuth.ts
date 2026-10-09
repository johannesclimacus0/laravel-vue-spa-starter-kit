import { twoFactorService } from '@/services/auth/TwoFactorService';
import type { UseTwoFactorAuthReturn } from '@/types/auth/two-factor';
import { computed, ref } from 'vue';

export const OTP_MAX_LENGTH = 6;

const errors = ref<string[]>([]);
const manualSetupKey = ref<string | null>(null);
const qrCodeSvg = ref<string | null>(null);
const recoveryCodesList = ref<string[]>([]);

const hasSetupData = computed<boolean>(
    () => qrCodeSvg.value !== null && manualSetupKey.value !== null,
);

/**
 * Shared module-level 2FA setup state.
 * Cleared on unmount of ManageTwoFactor so secrets do not linger.
 */
export function useTwoFactorAuth(): UseTwoFactorAuthReturn {
    const clearErrors = (): void => {
        errors.value = [];
    };

    const clearSetupData = (): void => {
        manualSetupKey.value = null;
        qrCodeSvg.value = null;
        clearErrors();
    };

    const clearTwoFactorAuthData = (): void => {
        clearSetupData();
        recoveryCodesList.value = [];
    };

    const fetchQrCode = async (): Promise<void> => {
        try {
            const { svg } = await twoFactorService.fetchTwoFactorQrCode();

            qrCodeSvg.value = svg;
        } catch {
            errors.value = [...errors.value, 'Failed to fetch QR code'];
            qrCodeSvg.value = null;
        }
    };

    const fetchSetupKey = async (): Promise<void> => {
        try {
            const { secretKey } =
                await twoFactorService.fetchTwoFactorSecretKey();

            manualSetupKey.value = secretKey;
        } catch {
            errors.value = [...errors.value, 'Failed to fetch a setup key'];
            manualSetupKey.value = null;
        }
    };

    const fetchRecoveryCodes = async (): Promise<void> => {
        try {
            clearErrors();
            recoveryCodesList.value =
                await twoFactorService.fetchRecoveryCodes();
        } catch {
            errors.value = [...errors.value, 'Failed to fetch recovery codes'];
            recoveryCodesList.value = [];
        }
    };

    const fetchSetupData = async (): Promise<void> => {
        clearErrors();
        await Promise.all([fetchQrCode(), fetchSetupKey()]);
    };

    return {
        qrCodeSvg,
        manualSetupKey,
        recoveryCodesList,
        errors,
        hasSetupData,
        clearSetupData,
        clearErrors,
        clearTwoFactorAuthData,
        fetchQrCode,
        fetchSetupKey,
        fetchSetupData,
        fetchRecoveryCodes,
    };
}
