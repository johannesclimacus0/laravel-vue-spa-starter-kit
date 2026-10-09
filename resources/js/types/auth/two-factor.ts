import type { ComputedRef, Ref } from 'vue';

export type TwoFactorConfigContent = {
    title: string;
    description: string;
    buttonText: string;
};

export type TwoFactorQrCode = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKeyResponse = {
    secretKey: string;
};

export type UseTwoFactorAuthReturn = {
    qrCodeSvg: Ref<string | null>;
    manualSetupKey: Ref<string | null>;
    recoveryCodesList: Ref<string[]>;
    errors: Ref<string[]>;
    hasSetupData: ComputedRef<boolean>;
    clearSetupData: () => void;
    clearErrors: () => void;
    clearTwoFactorAuthData: () => void;
    fetchQrCode: () => Promise<void>;
    fetchSetupKey: () => Promise<void>;
    fetchSetupData: () => Promise<void>;
    fetchRecoveryCodes: () => Promise<void>;
};
