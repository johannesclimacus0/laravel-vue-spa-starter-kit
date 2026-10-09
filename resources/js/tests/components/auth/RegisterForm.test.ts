import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RegisterForm from '@/components/auth/RegisterForm.vue';
import { useForm } from '@/composables/useForm';

describe('RegisterForm', () => {
    it('updates registration fields and emits submit', async () => {
        const form = useForm({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        });
        const wrapper = mount(RegisterForm, { props: { form } });

        await wrapper.find('#name').setValue('Jane Doe');
        await wrapper.find('#email').setValue('jane@example.com');
        await wrapper.find('#password').setValue('secret');
        await wrapper.find('#password_confirmation').setValue('secret');
        await wrapper.find('form').trigger('submit');

        expect(form.data).toEqual({
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'secret',
            password_confirmation: 'secret',
        });
        expect(wrapper.emitted('submit')).toHaveLength(1);
    });
});
