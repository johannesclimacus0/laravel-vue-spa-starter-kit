import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { RouterView } from 'vue-router';
import AuthBootstrap from '@/auth/AuthBootstrap.vue';
import { useAuthStore } from '@/stores/auth/index';
import SecuritySettingsPage from '@/pages/settings/SecuritySettingsPage.vue';
import { createSpaTestRouter } from '../../helpers/create-test-router';
import type { User } from '@/types';

vi.mock('@/services/auth/AuthService', () => ({
    authService: {
        fetchCurrentUser: vi.fn(),
        logout: vi.fn(),
    },
}));

vi.mock('@/services/settings/SettingsService', () => ({
    settingsService: {
        fetchPasswordConfirmationStatus: vi.fn(),
        fetchSecuritySettings: vi.fn(),
        updatePassword: vi.fn(),
        updateProfile: vi.fn(),
        deleteAccount: vi.fn(),
    },
}));

vi.mock('@/services/auth/TwoFactorService', () => ({
    twoFactorService: {
        enableTwoFactor: vi.fn(),
        disableTwoFactor: vi.fn(),
        confirmTwoFactor: vi.fn(),
        fetchTwoFactorQrCode: vi.fn(),
        fetchTwoFactorSecretKey: vi.fn(),
        fetchRecoveryCodes: vi.fn(),
        regenerateRecoveryCodes: vi.fn(),
    },
}));

import { authService } from '@/services/auth/AuthService';
import { settingsService } from '@/services/settings/SettingsService';
import { twoFactorService } from '@/services/auth/TwoFactorService';

const mockedFetchCurrentUser = vi.spyOn(authService, 'fetchCurrentUser');
const mockedFetchPasswordConfirmationStatus = vi.spyOn(
    settingsService,
    'fetchPasswordConfirmationStatus',
);
const mockedFetchSecuritySettings = vi.spyOn(
    settingsService,
    'fetchSecuritySettings',
);
const mockedFetchRecoveryCodes = vi.spyOn(
    twoFactorService,
    'fetchRecoveryCodes',
);

const verifiedUser: User = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    email_verified_at: '2026-01-01T00:00:00+00:00',
};

const securitySettings = {
    canManageTwoFactor: true,
    twoFactorEnabled: false,
    requiresConfirmation: true,
    passwordRules: 'minlength: 8;',
};

const AuthReadyShell = defineComponent({
    setup() {
        const auth = useAuthStore();

        return () => (auth.isLoading ? null : h(RouterView));
    },
});

async function mountSecurity(path = '/settings/security') {
    mockedFetchCurrentUser.mockResolvedValue(verifiedUser);

    const router = createSpaTestRouter({
        shell: AuthReadyShell,
        children: [
            {
                path: 'settings/security',
                component: SecuritySettingsPage,
            },
            {
                path: 'confirm-password',
                component: defineComponent({
                    template: '<div>Confirm password ready</div>',
                }),
            },
        ],
    });

    await router.push(path);
    await router.isReady();

    const wrapper = mount(
        defineComponent({
            components: { AuthBootstrap, RouterView },
            template: '<AuthBootstrap><RouterView /></AuthBootstrap>',
        }),
        {
            global: { plugins: [router] },
        },
    );

    await flushPromises();

    return { wrapper, router };
}

describe('SecuritySettingsPage', () => {
    beforeEach(() => {
        mockedFetchCurrentUser.mockReset();
        mockedFetchPasswordConfirmationStatus.mockReset();
        mockedFetchSecuritySettings.mockReset();
        mockedFetchRecoveryCodes.mockReset();
    });

    it('shows security-skeleton before password controls', async () => {
        let resolveStatus: (value: { confirmed: boolean }) => void = () =>
            undefined;

        mockedFetchPasswordConfirmationStatus.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveStatus = resolve;
                }),
        );
        mockedFetchSecuritySettings.mockResolvedValue(securitySettings);

        const { wrapper } = await mountSecurity();

        expect(wrapper.find('[data-testid="security-skeleton"]').exists()).toBe(
            true,
        );
        expect(wrapper.find('#current_password').exists()).toBe(false);
        expect(wrapper.text()).not.toContain('Update password');

        resolveStatus({ confirmed: true });
        await flushPromises();
        await nextTick();

        expect(wrapper.find('[data-testid="security-skeleton"]').exists()).toBe(
            false,
        );
        expect(wrapper.find('#current_password').exists()).toBe(true);
    });

    it('redirects to confirm-password when confirmation status is false without flashing controls', async () => {
        mockedFetchPasswordConfirmationStatus.mockResolvedValue({
            confirmed: false,
        });

        const { wrapper, router } = await mountSecurity();

        expect(router.currentRoute.value.path).toBe('/confirm-password');
        expect(wrapper.find('#current_password').exists()).toBe(false);
        expect(
            wrapper.find('[data-test="update-password-button"]').exists(),
        ).toBe(false);
        expect(wrapper.text()).not.toContain('Update password');
        expect(mockedFetchSecuritySettings).not.toHaveBeenCalled();
        expect(mockedFetchRecoveryCodes).not.toHaveBeenCalled();
    });

    it('when confirmed loads security settings once and never fetches recovery codes', async () => {
        mockedFetchPasswordConfirmationStatus.mockResolvedValue({
            confirmed: true,
        });
        mockedFetchSecuritySettings.mockResolvedValue(securitySettings);

        const { wrapper } = await mountSecurity();

        expect(mockedFetchPasswordConfirmationStatus).toHaveBeenCalledTimes(1);
        expect(mockedFetchSecuritySettings).toHaveBeenCalledTimes(1);
        expect(mockedFetchRecoveryCodes).not.toHaveBeenCalled();
        expect(mockedFetchCurrentUser).toHaveBeenCalledTimes(1);
        expect(wrapper.find('#current_password').exists()).toBe(true);
        expect(wrapper.text()).toContain('Update password');
        expect(wrapper.text()).not.toContain('Passkeys');
    });

    it('when twoFactorEnabled shows Disable 2FA and View recovery codes without fetching codes', async () => {
        mockedFetchPasswordConfirmationStatus.mockResolvedValue({
            confirmed: true,
        });
        mockedFetchSecuritySettings.mockResolvedValue({
            ...securitySettings,
            twoFactorEnabled: true,
        });

        const { wrapper } = await mountSecurity();

        expect(wrapper.text()).toContain('Disable 2FA');
        expect(wrapper.text()).toContain('View recovery codes');
        expect(mockedFetchRecoveryCodes).not.toHaveBeenCalled();
    });
});
