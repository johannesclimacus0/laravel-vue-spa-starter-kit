import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileDetailsForm from '@/components/settings/ProfileDetailsForm.vue';
import type { User } from '@/types/auth';

const { updateProfile, resendVerificationEmail } = vi.hoisted(() => ({
    updateProfile: vi.fn(),
    resendVerificationEmail: vi.fn(),
}));

vi.mock('@/services/settings/SettingsService', () => ({
    settingsService: { updateProfile },
}));
vi.mock('@/services/auth/AuthService', () => ({
    authService: { resendVerificationEmail },
}));

const user: User = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    email_verified_at: null,
};

describe('ProfileDetailsForm', () => {
    beforeEach(() => {
        updateProfile.mockReset();
        resendVerificationEmail.mockReset();
    });

    it('emits saved after a successful update', async () => {
        updateProfile.mockResolvedValue(undefined);
        const wrapper = mount(ProfileDetailsForm, { props: { user } });

        await wrapper.find('#name').setValue('Jane Updated');
        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(updateProfile).toHaveBeenCalledWith({
            name: 'Jane Updated',
            email: 'jane@example.com',
        });
        expect(wrapper.emitted('saved')).toHaveLength(1);
        expect(wrapper.text()).toContain('Profile updated.');
    });

    it('keeps validation errors visible', async () => {
        updateProfile.mockRejectedValue({
            kind: 'validation',
            message: 'The given data was invalid.',
            errors: { name: ['Name is required.'] },
        });
        const wrapper = mount(ProfileDetailsForm, { props: { user } });

        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(wrapper.find('#name-error').text()).toBe('Name is required.');
        expect(wrapper.find('#name').attributes('aria-describedby')).toBe(
            'name-error',
        );
    });

    it('shows verification resend feedback', async () => {
        resendVerificationEmail.mockResolvedValue('verification-link-sent');
        const wrapper = mount(ProfileDetailsForm, { props: { user } });

        await wrapper.find('button[type="button"]').trigger('click');
        await flushPromises();

        expect(wrapper.text()).toContain(
            'A new verification link has been sent to your email address.',
        );
    });
});
