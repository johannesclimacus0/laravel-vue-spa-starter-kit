export type LoginFormData = {
    email: string;
    password: string;
    remember: boolean;
};

export type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type ResetPasswordFormData = {
    email: string;
    password: string;
    password_confirmation: string;
};

export type TwoFactorChallengeFormData = {
    recovery_code: string;
};
