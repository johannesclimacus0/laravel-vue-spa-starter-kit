import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormFieldError from '@/components/shared/FormFieldError.vue';
import FormStatusMessage from '@/components/shared/FormStatusMessage.vue';

describe('form feedback components', () => {
    it('renders an accessible field error and optional id', () => {
        const wrapper = mount(FormFieldError, {
            props: { message: 'Email is invalid.', id: 'email-error' },
        });

        expect(wrapper.attributes('id')).toBe('email-error');
        expect(wrapper.attributes('role')).toBe('alert');
        expect(wrapper.text()).toBe('Email is invalid.');
    });

    it('renders a polite status message', () => {
        const wrapper = mount(FormStatusMessage, {
            props: { message: 'Saved.' },
        });

        expect(wrapper.attributes('role')).toBe('status');
        expect(wrapper.attributes('aria-live')).toBe('polite');
        expect(wrapper.text()).toBe('Saved.');
    });
});
