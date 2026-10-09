import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PasswordUpdateForm from '@/components/settings/PasswordUpdateForm.vue';

const { updatePassword } = vi.hoisted(() => ({ updatePassword: vi.fn() }));

vi.mock('@/services/settings/SettingsService', () => ({
    settingsService: { updatePassword },
}));

describe('PasswordUpdateForm', () => {
    beforeEach(() => {
        updatePassword.mockReset();
    });

    it('submits password fields and shows success feedback', async () => {
        updatePassword.mockResolvedValue(undefined);
        const wrapper = mount(PasswordUpdateForm, {
            props: { passwordRules: 'minlength: 8;' },
        });

        await wrapper.find('#current_password').setValue('old-password');
        await wrapper.find('#password').setValue('new-password');
        await wrapper.find('#password_confirmation').setValue('new-password');
        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(updatePassword).toHaveBeenCalledWith({
            current_password: 'old-password',
            password: 'new-password',
            password_confirmation: 'new-password',
        });
        expect(wrapper.text()).toContain('Password updated.');
    });

    it('keeps validation feedback connected to the field', async () => {
        updatePassword.mockRejectedValue({
            kind: 'validation',
            message: 'The given data was invalid.',
            errors: { current_password: ['Current password is incorrect.'] },
        });
        const wrapper = mount(PasswordUpdateForm, {
            props: { passwordRules: 'minlength: 8;' },
        });

        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(wrapper.find('#current_password-error').text()).toBe(
            'Current password is incorrect.',
        );
        expect(
            wrapper.find('#current_password').attributes('aria-describedby'),
        ).toBe('current_password-error');
    });
});
