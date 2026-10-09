<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/index';
import DeleteAccountSection from '@/components/settings/DeleteAccountSection.vue';
import ProfileDetailsForm from '@/components/settings/ProfileDetailsForm.vue';
import SettingsNavigation from '@/components/settings/SettingsNavigation.vue';

const auth = useAuthStore();
const router = useRouter();

async function onProfileSaved(): Promise<void> {
    await auth.refreshUser();
}

async function onAccountDeleted(): Promise<void> {
    auth.setUser(null);
    await router.replace('/');
}

onMounted(() => {
    document.title = 'Profile settings';
});
</script>

<template>
    <main class="mx-auto max-w-3xl space-y-8 px-4 py-8">
        <header>
            <h1 class="text-2xl font-semibold">Settings</h1>
            <SettingsNavigation current-page="profile" />
        </header>

        <ProfileDetailsForm :user="auth.user" @saved="onProfileSaved" />
        <DeleteAccountSection @deleted="onAccountDeleted" />
    </main>
</template>
