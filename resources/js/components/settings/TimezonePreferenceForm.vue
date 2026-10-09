<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { isRequestAborted, normalizeApiError } from '@/http/http';
import { usePreferencesStore } from '@/stores/preferences';
import FormFieldError from '@/components/shared/FormFieldError.vue';
import FormStatusMessage from '@/components/shared/FormStatusMessage.vue';

const preferencesStore = usePreferencesStore();
const phase = ref<'loading' | 'ready' | 'error'>('loading');
const selectedTimezone = ref('UTC');
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const controller = new AbortController();
const timezones = [
    'UTC',
    ...Intl.supportedValuesOf('timeZone').filter(
        (timezone) => timezone !== 'UTC',
    ),
];

async function saveTimezone(): Promise<void> {
    errorMessage.value = null;
    successMessage.value = null;

    try {
        await preferencesStore.saveTimezone(selectedTimezone.value);
        successMessage.value = 'Time zone updated.';
    } catch (error) {
        errorMessage.value = normalizeApiError(error).message;
    }
}

onMounted(async () => {
    try {
        await preferencesStore.loadPreferences(controller.signal);
        const currentTimezone = preferencesStore.preferences?.timezone;

        if (currentTimezone && !timezones.includes(currentTimezone)) {
            timezones.unshift(currentTimezone);
        }

        selectedTimezone.value = currentTimezone ?? 'UTC';
        phase.value = 'ready';
    } catch (error) {
        if (isRequestAborted(error)) return;

        errorMessage.value = normalizeApiError(error).message;
        phase.value = 'error';
    }
});

onUnmounted(() => controller.abort());
</script>

<template>
    <section>
        <h2 class="text-lg font-semibold">Appearance</h2>
        <p
            v-if="phase === 'loading'"
            class="mt-2 text-sm text-neutral-600"
            aria-live="polite"
        >
            Loading preferences…
        </p>
        <FormFieldError
            v-else-if="phase === 'error' && errorMessage"
            class="mt-2"
            :message="errorMessage"
        />
        <form
            v-else-if="phase === 'ready'"
            class="mt-4 space-y-3"
            @submit.prevent="saveTimezone"
        >
            <label for="timezone" class="block text-sm font-medium">
                Time zone
            </label>
            <select
                id="timezone"
                v-model="selectedTimezone"
                class="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
                @change="successMessage = null"
            >
                <option
                    v-for="timezone in timezones"
                    :key="timezone"
                    :value="timezone"
                >
                    {{ timezone }}
                </option>
            </select>
            <button
                type="submit"
                class="rounded border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="
                    preferencesStore.isSaving ||
                    selectedTimezone === preferencesStore.preferences?.timezone
                "
            >
                {{ preferencesStore.isSaving ? 'Saving…' : 'Save time zone' }}
            </button>
            <FormFieldError v-if="errorMessage" :message="errorMessage" />
            <FormStatusMessage
                v-if="successMessage"
                :message="successMessage"
            />
        </form>
    </section>
</template>
