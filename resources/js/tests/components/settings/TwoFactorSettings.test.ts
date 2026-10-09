import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TwoFactorSettings from '@/components/settings/TwoFactorSettings.vue';
import type { SecuritySettings } from '@/types/settings/security';

const {
    enableTwoFactor,
    confirmTwoFactor,
    disableTwoFactor,
    fetchTwoFactorQrCode,
    fetchTwoFactorSecretKey,
    fetchRecoveryCodes,
    regenerateRecoveryCodes,
} = vi.hoisted(() => ({
    enableTwoFactor: vi.fn(),
    confirmTwoFactor: vi.fn(),
    disableTwoFactor: vi.fn(),
    fetchTwoFactorQrCode: vi.fn(),
    fetchTwoFactorSecretKey: vi.fn(),
    fetchRecoveryCodes: vi.fn(),
    regenerateRecoveryCodes: vi.fn(),
}));

vi.mock('@/services/auth/TwoFactorService', () => ({
    twoFactorService: {
        enableTwoFactor,
        confirmTwoFactor,
        disableTwoFactor,
        fetchTwoFactorQrCode,
        fetchTwoFactorSecretKey,
        fetchRecoveryCodes,
        regenerateRecoveryCodes,
    },
}));

const settings: SecuritySettings = {
    canManageTwoFactor: true,
    twoFactorEnabled: false,
    requiresConfirmation: true,
    passwordRules: 'minlength: 8;',
};

async function mountTwoFactor(props: { settings: SecuritySettings }) {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/', component: { template: '<div />' } }],
    });

    const wrapper = mount(TwoFactorSettings, {
        props,
        global: { plugins: [router] },
    });
    return wrapper;
}

describe('TwoFactorSettings', () => {
    beforeEach(() => {
        for (const mock of [
            enableTwoFactor,
            confirmTwoFactor,
            disableTwoFactor,
            fetchTwoFactorQrCode,
            fetchTwoFactorSecretKey,
            fetchRecoveryCodes,
            regenerateRecoveryCodes,
        ])
            mock.mockReset();

        fetchTwoFactorQrCode.mockResolvedValue({ svg: '<svg />' });
        fetchTwoFactorSecretKey.mockResolvedValue({ secretKey: 'secret' });
        fetchRecoveryCodes.mockResolvedValue(['recovery-code']);
    });

    it('sets up and confirms two-factor authentication', async () => {
        enableTwoFactor.mockResolvedValue(undefined);
        confirmTwoFactor.mockResolvedValue(undefined);
        const wrapper = await mountTwoFactor({ settings });

        await wrapper.find('button').trigger('click');
        await flushPromises();
        expect(wrapper.text()).toContain('Setup key:');

        await wrapper.find('#two-factor-code').setValue('123456');
        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(confirmTwoFactor).toHaveBeenCalledWith({ code: '123456' });
        expect(wrapper.emitted('settings-changed')).toHaveLength(1);
    });

    it('cancels setup and clears the displayed setup data', async () => {
        enableTwoFactor.mockResolvedValue(undefined);
        const wrapper = await mountTwoFactor({ settings });

        await wrapper.find('button').trigger('click');
        await flushPromises();
        expect(wrapper.text()).toContain('Setup key:');

        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Cancel')
            ?.trigger('click');
        await flushPromises();

        expect(wrapper.text()).not.toContain('Setup key:');
        expect(wrapper.emitted('settings-changed')).toBeUndefined();
    });

    it('loads recovery codes on demand and disables two-factor', async () => {
        const enabledSettings = { ...settings, twoFactorEnabled: true };
        disableTwoFactor.mockResolvedValue(undefined);
        const wrapper = await mountTwoFactor({ settings: enabledSettings });

        const viewCodes = wrapper
            .findAll('button')
            .find((button) => button.text().includes('recovery codes'));
        await viewCodes?.trigger('click');
        await flushPromises();
        expect(wrapper.text()).toContain('recovery-code');
        expect(fetchRecoveryCodes).toHaveBeenCalledTimes(1);

        await wrapper.findAll('button')[0].trigger('click');
        await flushPromises();
        expect(disableTwoFactor).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('settings-changed')).toHaveLength(1);
    });
});
