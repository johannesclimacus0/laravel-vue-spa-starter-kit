import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeleteAccountSection from '@/components/settings/DeleteAccountSection.vue';

const { deleteAccount } = vi.hoisted(() => ({ deleteAccount: vi.fn() }));

vi.mock('@/services/settings/SettingsService', () => ({
    settingsService: { deleteAccount },
}));

describe('DeleteAccountSection', () => {
    beforeEach(() => {
        deleteAccount.mockReset();
    });

    it('requires a password and emits deleted after the request resolves', async () => {
        let resolveDelete = (): void => undefined;
        deleteAccount.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveDelete = () => resolve();
                }),
        );
        const wrapper = mount(DeleteAccountSection);

        expect(deleteAccount).not.toHaveBeenCalled();
        await wrapper.find('button[type="button"]').trigger('click');
        expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
        expect(deleteAccount).not.toHaveBeenCalled();

        await wrapper.find('#delete-password').setValue('password');
        const submission = wrapper
            .find('[role="dialog"] form')
            .trigger('submit');
        await Promise.resolve();

        expect(deleteAccount).toHaveBeenCalledWith({ password: 'password' });
        expect(wrapper.emitted('deleted')).toBeUndefined();
        resolveDelete();
        await submission;
        await flushPromises();
        expect(wrapper.emitted('deleted')).toHaveLength(1);
    });
});
