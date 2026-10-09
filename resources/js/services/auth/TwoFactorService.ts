import { ensureCsrfCookie, http, normalizeApiError } from '@/http/http';
import {
    confirm as confirmTwoFactorRoute,
    disable as disableTwoFactorRoute,
    enable as enableTwoFactorRoute,
    qrCode as twoFactorQrCodeRoute,
    recoveryCodes as twoFactorRecoveryCodesRoute,
    regenerateRecoveryCodes as regenerateTwoFactorRecoveryCodesRoute,
    secretKey as twoFactorSecretKeyRoute,
} from '@/routes/two-factor';
import type {
    TwoFactorQrCode,
    TwoFactorSecretKeyResponse,
} from '@/types/auth/two-factor';

export class TwoFactorService {
    async enableTwoFactor(): Promise<void> {
        await ensureCsrfCookie();
        await http.request(enableTwoFactorRoute());
    }

    async confirmTwoFactor(payload: { code: string }): Promise<void> {
        await ensureCsrfCookie();
        await http.request({ ...confirmTwoFactorRoute(), data: payload });
    }

    async disableTwoFactor(): Promise<void> {
        await ensureCsrfCookie();
        await http.request(disableTwoFactorRoute());
    }

    async fetchTwoFactorQrCode(): Promise<TwoFactorQrCode> {
        try {
            const response = await http.request<TwoFactorQrCode>(
                twoFactorQrCodeRoute(),
            );

            return response.data;
        } catch (error) {
            throw normalizeApiError(error);
        }
    }

    async fetchTwoFactorSecretKey(): Promise<{ secretKey: string }> {
        try {
            const response = await http.request<TwoFactorSecretKeyResponse>(
                twoFactorSecretKeyRoute(),
            );

            return response.data;
        } catch (error) {
            throw normalizeApiError(error);
        }
    }

    async fetchRecoveryCodes(): Promise<string[]> {
        try {
            const response = await http.request<string[]>(
                twoFactorRecoveryCodesRoute(),
            );

            return response.data;
        } catch (error) {
            throw normalizeApiError(error);
        }
    }

    async regenerateRecoveryCodes(): Promise<void> {
        await ensureCsrfCookie();
        await http.request(regenerateTwoFactorRecoveryCodesRoute());
    }
}

export const twoFactorService = new TwoFactorService();
