import {
    ensureCsrfCookie,
    http,
    isRequestAborted,
    normalizeApiError,
} from '@/http/http';
import type { PasswordConfirmationStatus } from '@/types/auth/session';
import type { MaybeWrapped } from '@/types/settings/api';
import type {
    UserPreferences,
    UserPreferencesResponse,
} from '@/types/settings/preferences';
import type { SecuritySettings } from '@/types/settings/security';
import { confirmation as confirmedPasswordStatusRoute } from '@/routes/password';
import { destroy as deleteProfileRoute } from '@/routes/profile';
import { update as updateUserPasswordRoute } from '@/routes/user-password';
import { update as updateProfileRoute } from '@/routes/user-profile-information';
import { security } from '@/routes/api/v1/settings';
import {
    show as showPreferencesRoute,
    update as updatePreferencesRoute,
} from '@/routes/api/v1/settings/preferences';

export type { UserPreferences } from '@/types/settings/preferences';
export type { SecuritySettings } from '@/types/settings/security';
export type { PasswordConfirmationStatus } from '@/types/auth/session';

function unwrap<T>(payload: MaybeWrapped<T>): T {
    if (
        typeof payload === 'object' &&
        payload !== null &&
        'data' in payload &&
        typeof (payload as { data: unknown }).data === 'object'
    ) {
        return (payload as { data: T }).data;
    }

    return payload as T;
}

export class SettingsService {
    async updateProfile(payload: {
        name: string;
        email: string;
    }): Promise<void> {
        await ensureCsrfCookie();
        await http.request({ ...updateProfileRoute(), data: payload });
    }

    async updatePreferences(
        preferences: UserPreferences,
    ): Promise<UserPreferences> {
        await ensureCsrfCookie();

        const response = await http.request<UserPreferencesResponse>({
            ...updatePreferencesRoute(),
            data: preferences,
        });

        return response.data.data;
    }

    async updatePassword(payload: {
        current_password: string;
        password: string;
        password_confirmation: string;
    }): Promise<void> {
        await ensureCsrfCookie();
        await http.request({ ...updateUserPasswordRoute(), data: payload });
    }

    async deleteAccount(payload: { password: string }): Promise<void> {
        await ensureCsrfCookie();
        await http.request({ ...deleteProfileRoute(), data: payload });
    }

    async fetchPreferences(options?: {
        signal?: AbortSignal;
    }): Promise<UserPreferences> {
        try {
            const response = await http.request<UserPreferencesResponse>({
                ...showPreferencesRoute(),
                signal: options?.signal,
            });

            return response.data.data;
        } catch (error) {
            if (isRequestAborted(error)) {
                throw error;
            }

            throw normalizeApiError(error);
        }
    }

    async fetchSecuritySettings(options?: {
        signal?: AbortSignal;
    }): Promise<SecuritySettings> {
        try {
            const response = await http.request<MaybeWrapped<SecuritySettings>>(
                { ...security(), signal: options?.signal },
            );

            return unwrap(response.data);
        } catch (error) {
            if (isRequestAborted(error)) {
                throw error;
            }

            throw normalizeApiError(error);
        }
    }

    async fetchPasswordConfirmationStatus(options?: {
        signal?: AbortSignal;
    }): Promise<PasswordConfirmationStatus> {
        try {
            const response = await http.request<PasswordConfirmationStatus>({
                ...confirmedPasswordStatusRoute(),
                signal: options?.signal,
            });

            return { confirmed: response.data.confirmed === true };
        } catch (error) {
            if (isRequestAborted(error)) {
                throw error;
            }

            throw normalizeApiError(error);
        }
    }
}

export const settingsService = new SettingsService();
