import App from '@/App.vue';
import { initializeTheme } from '@/composables/useAppearance';
import { configurePasskeysClient } from '@/lib/passkeys';
import { router } from '@/router';
import { createApp } from 'vue';
import { configureEcho } from '@laravel/echo-vue';

configureEcho({
    broadcaster: 'reverb',
});

configurePasskeysClient();
initializeTheme();

const rootElement = document.getElementById('app');

if (!rootElement) {
    throw new Error('Root element #app not found');
}

createApp(App).use(router).mount(rootElement);
