import { describe, expectTypeOf, it } from 'vitest';
import type { AuthStatus, User } from '@/types/auth/index';
import type {
    AuthStatusResponse,
    LoginResult,
    UserResponse,
} from '@/types/auth/service';
import type { PasswordConfirmationStatus } from '@/types/auth/session';
import type {
    TwoFactorConfigContent,
    TwoFactorQrCode,
} from '@/types/auth/two-factor';
import type { FormErrors, FormState } from '@/types/forms';
import type {
    AuthSessionHandlers,
    RequestConfigWithAuthMeta,
} from '@/http/types';
import type { MaybeWrapped } from '@/types/settings/api';
import type { SettingsPageKey } from '@/types/settings/navigation';
import type { UserPreferences } from '@/types/settings/preferences';
import type { SecuritySettings } from '@/types/settings/security';

describe('frontend public types', () => {
    it('exports the domain and infrastructure types from dedicated modules', () => {
        expectTypeOf<User>().toMatchTypeOf<{
            id: number;
            name: string;
            email: string;
            email_verified_at: string | null;
        }>();
        expectTypeOf<AuthStatus>().toEqualTypeOf<
            'loading' | 'authenticated' | 'unauthenticated'
        >();
        expectTypeOf<LoginResult>().toEqualTypeOf<{ two_factor: boolean }>();
        expectTypeOf<UserResponse>().toEqualTypeOf<{ data: User }>();
        expectTypeOf<AuthStatusResponse>().toMatchTypeOf<{
            status?: string;
            message?: string;
        }>();
        expectTypeOf<PasswordConfirmationStatus>().toEqualTypeOf<{
            confirmed: boolean;
        }>();
        expectTypeOf<TwoFactorConfigContent>().toEqualTypeOf<{
            title: string;
            description: string;
            buttonText: string;
        }>();
        expectTypeOf<TwoFactorQrCode>().toEqualTypeOf<{
            svg: string;
            url: string;
        }>();
        expectTypeOf<UserPreferences>().toEqualTypeOf<{ timezone: string }>();
        expectTypeOf<SecuritySettings>().toEqualTypeOf<{
            canManageTwoFactor: boolean;
            twoFactorEnabled: boolean;
            requiresConfirmation: boolean;
            passwordRules: string;
        }>();
        expectTypeOf<SettingsPageKey>().toEqualTypeOf<
            'profile' | 'security' | 'preferences'
        >();
        expectTypeOf<MaybeWrapped<User>>().toEqualTypeOf<
            User | { data: User }
        >();
        expectTypeOf<FormErrors>().toEqualTypeOf<Record<string, string>>();
        expectTypeOf<FormState<{ name: string }>>().toHaveProperty('submit');
        expectTypeOf<AuthSessionHandlers>().toMatchTypeOf<{
            onUnauthenticated?: () => void;
        }>();
        expectTypeOf<RequestConfigWithAuthMeta>().toMatchTypeOf<{
            skipAuthSessionHandlers?: boolean;
        }>();
    });
});
