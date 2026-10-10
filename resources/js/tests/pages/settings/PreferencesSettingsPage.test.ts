import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PreferencesSettingsPage from '@/pages/settings/PreferencesSettingsPage.vue';

const { fetchPreferences, updatePreferences } = vi.hoisted(() => ({
    fetchPreferences: vi.fn(),
    updatePreferences: vi.fn(),
}));

vi.mock('@/services/settings/SettingsService', () => ({
    settingsService: {
        fetchPreferences,
        updatePreferences,
    },
}));

describe('PreferencesSettingsPage', () => {
    beforeEach(() => {
        fetchPreferences.mockReset();
        updatePreferences.mockReset();
    });

    it('loads and displays the current time zone', async () => {
        fetchPreferences.mockResolvedValue({ timezone: 'Australia/Sydney' });

        const wrapper = mount(PreferencesSettingsPage, {
            global: { plugins: [createPinia()] },
        });

        await flushPromises();

        expect(fetchPreferences).toHaveBeenCalledTimes(1);
        expect(wrapper.text()).toContain('Australia/Sydney');
    });

    it('saves the selected time zone', async () => {
        fetchPreferences.mockResolvedValue({ timezone: 'Australia/Sydney' });
        updatePreferences.mockResolvedValue({ timezone: 'America/New_York' });

        const wrapper = mount(PreferencesSettingsPage, {
            global: { plugins: [createPinia()] },
        });

        await flushPromises();
        await wrapper.find('select').setValue('America/New_York');
        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(updatePreferences).toHaveBeenCalledWith({
            timezone: 'America/New_York',
        });
        expect(wrapper.text()).toContain('Time zone updated.');
    });
});
