<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isRequestAborted, normalizeApiError } from '@/http/http';
import { locationToPath } from '@/lib/navigation';
import { settingsService } from '@/services/settings/SettingsService';
import type { SecuritySettings } from '@/types/settings/security';
import PasswordUpdateForm from '@/components/settings/PasswordUpdateForm.vue';
import SettingsNavigation from '@/components/settings/SettingsNavigation.vue';
import TwoFactorSettings from '@/components/settings/TwoFactorSettings.vue';
import FormFieldError from '@/components/shared/FormFieldError.vue';

const router = useRouter();
const route = useRoute();
const settings = ref<SecuritySettings | null>(null);
const phase = ref<'loading' | 'ready' | 'error'>('loading');
const loadError = ref<string | null>(null);
let active = true;
const controller = new AbortController();

async function loadSettings(): Promise<void> {
    settings.value = await settingsService.fetchSecuritySettings();
}

onMounted(() => {
    document.title = 'Security settings';

    void (async () => {
        try {
            const { confirmed } =
                await settingsService.fetchPasswordConfirmationStatus({
                    signal: controller.signal,
                });

            if (!active) return;

            if (!confirmed) {
                await router.replace({
                    path: '/confirm-password',
                    state: { from: locationToPath(route) },
                });

                return;
            }

            const nextSettings = await settingsService.fetchSecuritySettings({
                signal: controller.signal,
            });

            if (!active) return;

            settings.value = nextSettings;
            phase.value = 'ready';
        } catch (error) {
            if (!active || isRequestAborted(error)) return;

            loadError.value = normalizeApiError(error).message;
            phase.value = 'error';
        }
    })();
});

onUnmounted(() => {
    active = false;
    controller.abort();
});
</script>

<template>
    <main class="mx-auto max-w-3xl space-y-8 px-4 py-8">
        <header>
            <h1 class="text-2xl font-semibold">Security settings</h1>
            <SettingsNavigation current-page="security" />
        </header>

        <div
            v-if="phase === 'loading'"
            class="space-y-8"
            aria-busy="true"
            aria-label="Loading security settings"
            data-testid="security-skeleton"
        >
            <p class="text-sm text-neutral-600">Loading security settings…</p>
        </div>

        <FormFieldError
            v-if="phase === 'error' && loadError"
            :message="loadError"
        />

        <template v-if="phase === 'ready' && settings">
            <PasswordUpdateForm :password-rules="settings.passwordRules" />
            <TwoFactorSettings
                :settings="settings"
                @settings-changed="loadSettings"
            />
        </template>
    </main>
</template>
