import App from '@/App.vue';
import { router } from '@/router';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { configureEcho } from '@laravel/echo-vue';

configureEcho({
    broadcaster: 'reverb',
});

createApp(App).use(createPinia()).use(router).mount('#app');
