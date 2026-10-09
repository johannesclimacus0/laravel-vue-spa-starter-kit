import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { RouterView } from 'vue-router';
import AuthBootstrap from '@/auth/AuthBootstrap.vue';
import { useAuthStore } from '@/stores/auth/index';
import ProfileSettingsPage from '@/pages/settings/ProfileSettingsPage.vue';
import { createSpaTestRouter } from '../../helpers/create-test-router';
import type { User } from '@/types';

vi.mock('@/services/auth/AuthService', () => ({
    authService: {
        fetchCurrentUser: vi.fn(),
        logout: vi.fn(),
        resendVerificationEmail: vi.fn(),
    },
}));

vi.mock('@/services/settings/SettingsService', () => ({
    settingsService: {
        updateProfile: vi.fn(),
        deleteAccount: vi.fn(),
        fetchPasswordConfirmationStatus: vi.fn(),
        fetchSecuritySettings: vi.fn(),
        updatePassword: vi.fn(),
    },
}));

import { authService } from '@/services/auth/AuthService';
import { settingsService } from '@/services/settings/SettingsService';

const mockedFetchCurrentUser = vi.spyOn(authService, 'fetchCurrentUser');
const mockedResendVerificationEmail = vi.spyOn(
    authService,
    'resendVerificationEmail',
);
const mockedUpdateProfile = vi.spyOn(settingsService, 'updateProfile');
const mockedDeleteAccount = vi.spyOn(settingsService, 'deleteAccount');

const verifiedUser: User = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    email_verified_at: '2026-01-01T00:00:00+00:00',
};

const AuthReadyShell = defineComponent({
    setup() {
        const auth = useAuthStore();

        return () => (auth.isLoading ? null : h(RouterView));
    },
});

async function mountProfile(user: User = verifiedUser) {
    mockedFetchCurrentUser.mockResolvedValue(user);

    const router = createSpaTestRouter({
        shell: AuthReadyShell,
        children: [
            {
                path: 'settings/profile',
                component: ProfileSettingsPage,
            },
        ],
    });

    await router.push('/settings/profile');
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

describe('ProfileSettingsPage', () => {
    beforeEach(() => {
        mockedFetchCurrentUser.mockReset();
        mockedResendVerificationEmail.mockReset();
        mockedUpdateProfile.mockReset();
        mockedDeleteAccount.mockReset();
    });

    it('renders name and email from the auth user', async () => {
        const { wrapper } = await mountProfile();

        const name = wrapper.find('input#name');
        const email = wrapper.find('input#email');

        expect((name.element as HTMLInputElement).value).toBe('Jane Doe');
        expect((email.element as HTMLInputElement).value).toBe(
            'jane@example.com',
        );
    });

    it('submits updateProfile then refreshUser', async () => {
        mockedUpdateProfile.mockResolvedValue(undefined);
        mockedFetchCurrentUser
            .mockResolvedValueOnce(verifiedUser)
            .mockResolvedValueOnce({
                ...verifiedUser,
                name: 'Jane Updated',
            });

        const { wrapper } = await mountProfile();

        await wrapper.find('input#name').setValue('Jane Updated');
        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();

        expect(mockedUpdateProfile).toHaveBeenCalledTimes(1);
        expect(mockedUpdateProfile).toHaveBeenCalledWith({
            name: 'Jane Updated',
            email: 'jane@example.com',
        });
        // bootstrap + refresh after profile update
        expect(mockedFetchCurrentUser).toHaveBeenCalledTimes(2);
        expect(wrapper.text()).toContain('Profile updated.');
    });

    it('shows unverified email UI when email_verified_at is null', async () => {
        const { wrapper } = await mountProfile({
            ...verifiedUser,
            email_verified_at: null,
        });

        await nextTick();

        expect(wrapper.text()).toContain('Your email address is unverified.');
        expect(wrapper.text()).toContain(
            'Click here to re-send the verification email.',
        );
    });

    it('resends verification and displays the response', async () => {
        mockedResendVerificationEmail.mockResolvedValue(
            'verification-link-sent',
        );
        const { wrapper } = await mountProfile({
            ...verifiedUser,
            email_verified_at: null,
        });

        await wrapper.find('button[type="button"]').trigger('click');
        await flushPromises();

        expect(mockedResendVerificationEmail).toHaveBeenCalledTimes(1);
        expect(wrapper.text()).toContain(
            'A new verification link has been sent to your email address.',
        );
    });

    it('asks for a password before deleting the account', async () => {
        mockedDeleteAccount.mockResolvedValue(undefined);
        const { wrapper, router } = await mountProfile();

        expect(mockedDeleteAccount).not.toHaveBeenCalled();
        const deleteAccountButton = wrapper
            .findAll('button')
            .find(
                (button) =>
                    button.text() === 'Delete account' &&
                    button.attributes('type') !== 'submit',
            );
        await deleteAccountButton?.trigger('click');
        expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
        expect(mockedDeleteAccount).not.toHaveBeenCalled();

        await wrapper.find('input#delete-password').setValue('password');
        await wrapper.find('[role="dialog"] form').trigger('submit.prevent');
        await flushPromises();

        expect(mockedDeleteAccount).toHaveBeenCalledWith({
            password: 'password',
        });
        expect(useAuthStore().user).toBeNull();
        expect(router.currentRoute.value.path).toBe('/');
    });
});
