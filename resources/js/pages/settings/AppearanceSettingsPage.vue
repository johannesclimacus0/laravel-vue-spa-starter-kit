<script setup lang="ts">
import { onMounted } from 'vue';
import SettingsNavigation from '@/components/settings/SettingsNavigation.vue';
import TimezonePreferenceForm from '@/components/settings/TimezonePreferenceForm.vue';

onMounted(() => {
    document.title = 'Appearance settings';
});
</script>

<template>
    <main class="mx-auto max-w-3xl space-y-8 px-4 py-8">
        <header>
            <h1 class="text-2xl font-semibold">Settings</h1>
            <SettingsNavigation current-page="appearance" />
        </header>
        <TimezonePreferenceForm />
    </main>
</template>
