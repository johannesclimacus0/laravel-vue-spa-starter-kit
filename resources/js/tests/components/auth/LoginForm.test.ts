import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import LoginForm from '@/components/auth/LoginForm.vue';
import { useForm } from '@/composables/useForm';

describe('LoginForm', () => {
    it('updates form data and emits submit', async () => {
        const form = useForm({ email: '', password: '', remember: false });
        const wrapper = mount(LoginForm, {
            props: { form, flashStatus: null },
        });

        await wrapper.find('#email').setValue('jane@example.com');
        await wrapper.find('#password').setValue('secret');
        await wrapper.find('#remember').setValue(true);
        await wrapper.find('form').trigger('submit');

        expect(form.data).toEqual({
            email: 'jane@example.com',
            password: 'secret',
            remember: true,
        });
        expect(wrapper.emitted('submit')).toHaveLength(1);
    });

    it('shows errors and disables submit while the page processes the request', () => {
        const form = useForm({ email: '', password: '', remember: false });
        form.errors.email = 'Invalid email';
        form.processing = true;
        const wrapper = mount(LoginForm, { props: { form } });

        expect(wrapper.find('#email-error').text()).toBe('Invalid email');
        expect(
            wrapper.find('[data-test="login-button"]').attributes('disabled'),
        ).toBeDefined();
    });
});
