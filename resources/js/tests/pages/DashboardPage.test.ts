import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import AuthBootstrap from '@/auth/AuthBootstrap.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import AppShell from '@/layouts/AppShell.vue';
import { createSpaTestRouter } from '../helpers/create-test-router';
import type { User } from '@/types';

vi.mock('@/services/auth/AuthService', () => ({
    authService: {
        fetchCurrentUser: vi.fn(),
        logout: vi.fn(),
    },
}));

vi.mock('@/services/settings/SettingsService', () => ({
    settingsService: {
        updateProfile: vi.fn(),
        updatePassword: vi.fn(),
        deleteAccount: vi.fn(),
        fetchSecuritySettings: vi.fn(),
        fetchPasswordConfirmationStatus: vi.fn(),
    },
}));

import { authService } from '@/services/auth/AuthService';
import { settingsService } from '@/services/settings/SettingsService';

const mockedFetchCurrentUser = vi.spyOn(authService, 'fetchCurrentUser');

const verifiedUser: User = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    email_verified_at: '2026-01-01T00:00:00+00:00',
};

async function mountDashboard() {
    mockedFetchCurrentUser.mockResolvedValue(verifiedUser);

    const router = createSpaTestRouter({
        shell: AppShell,
        children: [
            {
                path: 'dashboard',
                component: DashboardPage,
            },
        ],
    });

    await router.push('/dashboard');
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

    return { wrapper };
}

describe('DashboardPage', () => {
    beforeEach(() => {
        mockedFetchCurrentUser.mockReset();

        for (const value of Object.values(settingsService)) {
            if (typeof value === 'function' && 'mockReset' in value) {
                (value as ReturnType<typeof vi.fn>).mockReset();
            }
        }
    });

    it('renders without calling settings-api or refreshing beyond bootstrap', async () => {
        const { wrapper } = await mountDashboard();

        expect(wrapper.find('nav[aria-label="Main"]').exists()).toBe(true);
        expect(document.title).toContain('Dashboard');
        expect(wrapper.findAll('svg pattern')).toHaveLength(0);
        expect(wrapper.text()).toContain('Dashboard');
        expect(mockedFetchCurrentUser).toHaveBeenCalledTimes(1);

        for (const [name, value] of Object.entries(settingsService)) {
            if (typeof value === 'function' && 'mock' in value) {
                expect(
                    value,
                    `settings-api.${name} should not be called`,
                ).not.toHaveBeenCalled();
            }
        }
    });
});
