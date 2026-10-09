import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SettingsNavigation from '@/components/settings/SettingsNavigation.vue';

describe('SettingsNavigation', () => {
    it('marks the current settings page and renders all destinations', () => {
        const wrapper = mount(SettingsNavigation, {
            props: { currentPage: 'security' },
        });

        expect(wrapper.find('a[aria-current="page"]').text()).toBe('Security');
        expect(wrapper.findAll('a')).toHaveLength(3);
        expect(wrapper.find('a[href="/settings/profile"]').exists()).toBe(true);
        expect(wrapper.find('a[href="/settings/appearance"]').exists()).toBe(
            true,
        );
    });
});
