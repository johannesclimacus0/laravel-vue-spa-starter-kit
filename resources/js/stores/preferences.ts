import { defineStore } from 'pinia';
import { ref } from 'vue';
import { settingsService } from '@/services/settings/SettingsService';
import type { UserPreferences } from '@/types/settings/preferences';

export const usePreferencesStore = defineStore('preferences', () => {
    const preferences = ref<UserPreferences | null>(null);
    const isLoading = ref(false);
    const isSaving = ref(false);

    const loadPreferences = async (signal?: AbortSignal): Promise<void> => {
        isLoading.value = true;

        try {
            preferences.value = await settingsService.fetchPreferences({
                signal,
            });
        } finally {
            isLoading.value = false;
        }
    };

    const saveTimezone = async (timezone: string): Promise<void> => {
        isSaving.value = true;

        try {
            preferences.value = await settingsService.updatePreferences({
                timezone,
            });
        } finally {
            isSaving.value = false;
        }
    };

    return {
        preferences,
        isLoading,
        isSaving,
        loadPreferences,
        saveTimezone,
    };
});
