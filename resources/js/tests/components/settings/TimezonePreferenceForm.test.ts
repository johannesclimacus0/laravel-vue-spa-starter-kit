import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TimezonePreferenceForm from '@/components/settings/TimezonePreferenceForm.vue';

const { fetchPreferences, updatePreferences } = vi.hoisted(() => ({
    fetchPreferences: vi.fn(),
    updatePreferences: vi.fn(),
}));

vi.mock('@/services/settings/SettingsService', () => ({
    settingsService: { fetchPreferences, updatePreferences },
}));

describe('TimezonePreferenceForm', () => {
    beforeEach(() => {
        fetchPreferences.mockReset();
        updatePreferences.mockReset();
    });

    it('shows loading while preferences are being fetched', async () => {
        let resolvePreferences: (value: { timezone: string }) => void = () =>
            undefined;
        fetchPreferences.mockImplementation(
            () => new Promise((resolve) => (resolvePreferences = resolve)),
        );

        const wrapper = mount(TimezonePreferenceForm, {
            global: { plugins: [createPinia()] },
        });

        expect(wrapper.text()).toContain('Loading preferences');
        resolvePreferences({ timezone: 'UTC' });
        await flushPromises();
        expect(wrapper.find('select').exists()).toBe(true);
    });

    it('keeps an existing timezone even when it is outside the supported list', async () => {
        fetchPreferences.mockResolvedValue({ timezone: 'US/Pacific-New' });

        const wrapper = mount(TimezonePreferenceForm, {
            global: { plugins: [createPinia()] },
        });
        await flushPromises();

        expect(
            (wrapper.find('select').element as HTMLSelectElement).value,
        ).toBe('US/Pacific-New');
        expect(wrapper.find('option[value="US/Pacific-New"]').exists()).toBe(
            true,
        );
    });

    it('shows a save error and allows a successful retry', async () => {
        fetchPreferences.mockResolvedValue({ timezone: 'UTC' });
        updatePreferences
            .mockRejectedValueOnce(new Error('Could not save time zone.'))
            .mockResolvedValueOnce({ timezone: 'America/New_York' });

        const wrapper = mount(TimezonePreferenceForm, {
            global: { plugins: [createPinia()] },
        });
        await flushPromises();
        await wrapper.find('select').setValue('America/New_York');
        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(wrapper.text()).toContain('Could not save time zone.');
        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(updatePreferences).toHaveBeenCalledTimes(2);
        expect(wrapper.text()).toContain('Time zone updated.');
    });
});
