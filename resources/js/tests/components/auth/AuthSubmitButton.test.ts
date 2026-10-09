import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton.vue';

describe('AuthSubmitButton', () => {
    it('shows the label and disables itself while submitting', () => {
        const wrapper = mount(AuthSubmitButton, {
            props: {
                label: 'Log in',
                processing: true,
                testId: 'login-button',
            },
        });

        expect(wrapper.text()).toContain('Working…');
        expect(wrapper.text()).toContain('Log in');
        expect(wrapper.attributes('disabled')).toBeDefined();
        expect(wrapper.attributes('data-test')).toBe('login-button');
    });
});
