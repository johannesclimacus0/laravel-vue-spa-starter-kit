<script setup lang="ts">
import type { SettingsPageKey } from '@/types/settings/navigation';

defineProps<{ currentPage: SettingsPageKey }>();

const pages: { key: SettingsPageKey; label: string; href: string }[] = [
    { key: 'profile', label: 'Profile', href: '/settings/profile' },
    { key: 'security', label: 'Security', href: '/settings/security' },
    { key: 'appearance', label: 'Appearance', href: '/settings/appearance' },
];
</script>

<template>
    <nav
        class="mt-4 flex gap-4 border-b border-neutral-200 pb-3"
        aria-label="Settings"
    >
        <a
            v-for="page in pages"
            :key="page.key"
            :href="page.href"
            :aria-current="currentPage === page.key ? 'page' : undefined"
            :class="currentPage === page.key ? 'font-semibold' : undefined"
        >
            {{ page.label }}
        </a>
    </nav>
</template>
