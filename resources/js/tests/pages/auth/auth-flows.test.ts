import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import AuthBootstrap from '@/auth/AuthBootstrap.vue';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage.vue';
import TwoFactorChallengePage from '@/pages/auth/TwoFactorChallengePage.vue';
import ConfirmPasswordPage from '@/pages/auth/ConfirmPasswordPage.vue';
import { createSpaTestRouter } from '../../helpers/create-test-router';

vi.mock('@/services/auth/AuthService', () => ({
    authService: {
        fetchCurrentUser: vi.fn(),
        logout: vi.fn(),
        requestPasswordReset: vi.fn(),
        confirmPassword: vi.fn(),
        submitTwoFactorChallenge: vi.fn(),
    },
}));

import { authService } from '@/services/auth/AuthService';

const mockedFetchCurrentUser = vi.spyOn(authService, 'fetchCurrentUser');
const mockedRequestPasswordReset = vi.spyOn(
    authService,
    'requestPasswordReset',
);
const mockedSubmitTwoFactorChallenge = vi.spyOn(
    authService,
    'submitTwoFactorChallenge',
);
const mockedConfirmPassword = vi.spyOn(authService, 'confirmPassword');

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        mockedFetchCurrentUser.mockReset();
        mockedRequestPasswordReset.mockReset();
        mockedFetchCurrentUser.mockResolvedValue(null);
    });

    it('shows success status after requesting a reset link', async () => {
        mockedRequestPasswordReset.mockResolvedValue(
            'We have emailed your password reset link.',
        );

        const router = createSpaTestRouter({
            children: [
                {
                    path: 'forgot-password',
                    component: ForgotPasswordPage,
                },
            ],
        });

        await router.push('/forgot-password');
        await router.isReady();

        const wrapper = mount(
            defineComponent({
                components: { AuthBootstrap, RouterView },
                template: '<AuthBootstrap><RouterView /></AuthBootstrap>',
            }),
            { global: { plugins: [router] } },
        );

        await flushPromises();

        await wrapper.find('input#email').setValue('jane@example.com');
        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();

        expect(wrapper.text()).toContain(
            'We have emailed your password reset link.',
        );
    });
});

describe('TwoFactorChallengePage', () => {
    beforeEach(() => {
        mockedFetchCurrentUser.mockReset();
        mockedSubmitTwoFactorChallenge.mockReset();
        mockedFetchCurrentUser.mockResolvedValue(null);
    });

    it('toggles between otp and recovery modes', async () => {
        const router = createSpaTestRouter({
            children: [
                {
                    path: 'two-factor-challenge',
                    component: TwoFactorChallengePage,
                },
            ],
        });

        await router.push('/two-factor-challenge');
        await router.isReady();

        const wrapper = mount(
            defineComponent({
                components: { AuthBootstrap, RouterView },
                template: '<AuthBootstrap><RouterView /></AuthBootstrap>',
            }),
            { global: { plugins: [router] } },
        );

        await flushPromises();

        expect(wrapper.text()).toContain('Authentication code');
        await wrapper
            .findAll('button')
            .find((button) =>
                button.text().includes('login using a recovery code'),
            )
            ?.trigger('click');
        await flushPromises();

        expect(wrapper.text()).toContain('Recovery code');
        expect(wrapper.find('input#recovery_code').exists()).toBe(true);
    });
});

describe('ConfirmPasswordPage', () => {
    beforeEach(() => {
        mockedFetchCurrentUser.mockReset();
        mockedConfirmPassword.mockReset();
        mockedFetchCurrentUser.mockResolvedValue({
            id: 1,
            name: 'Jane',
            email: 'jane@example.com',
            email_verified_at: '2026-01-01T00:00:00+00:00',
        });
    });

    it('confirms password and navigates to a safe intended path', async () => {
        mockedConfirmPassword.mockResolvedValue(undefined);

        const router = createSpaTestRouter({
            children: [
                {
                    path: 'confirm-password',
                    component: ConfirmPasswordPage,
                },
                {
                    path: 'settings/security',
                    component: defineComponent({
                        template: '<div>Security ready</div>',
                    }),
                },
            ],
        });

        await router.push('/confirm-password');
        await router.isReady();

        const wrapper = mount(
            defineComponent({
                components: { AuthBootstrap, RouterView },
                template: '<AuthBootstrap><RouterView /></AuthBootstrap>',
            }),
            { global: { plugins: [router] } },
        );

        await flushPromises();

        await wrapper.find('input#password').setValue('password');
        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();

        expect(mockedConfirmPassword).toHaveBeenCalledTimes(1);
        expect(router.currentRoute.value.path).toBe('/settings/security');
    });
});
