import AppShell from '@/layouts/AppShell.vue';
import GuestRoute from '@/router/auth/GuestRoute.vue';
import ProtectedRoute from '@/router/auth/ProtectedRoute.vue';
import VerifiedRoute from '@/router/auth/VerifiedRoute.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: AppShell,
        children: [
            { path: '', redirect: '/login' },
            { path: '', component: GuestRoute,
                children: [
                    { path: 'login', name: 'login', component: () => import('@/pages/auth/LoginPage.vue') },
                    { path: 'register', name: 'register', component: () => import('@/pages/auth/RegisterPage.vue') },
                    { path: 'forgot-password', name: 'forgot-password', component: () => import('@/pages/auth/ForgotPasswordPage.vue') },
                    { path: 'reset-password/:token', name: 'reset-password', component: () => import('@/pages/auth/ResetPasswordPage.vue') },
                    { path: 'two-factor-challenge', name: 'two-factor-challenge', component: () => import('@/pages/auth/TwoFactorChallengePage.vue') },
                ]
            },
            { path: '', component: ProtectedRoute,
                children: [
                    { path: 'verify-email', name: 'verify-email', component: () => import('@/pages/auth/VerifyEmailPage.vue') },
                    { path: 'confirm-password', name: 'confirm-password', component: () => import('@/pages/auth/ConfirmPasswordPage.vue') },
                ]
            },
            { path: '', component: VerifiedRoute,
                children: [
                    { path: 'dashboard', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
                    { path: 'settings', redirect: '/settings/profile' },
                    { path: 'settings/profile', name: 'settings.profile', component: () => import('@/pages/settings/ProfileSettingsPage.vue') },
                    { path: 'settings/security', name: 'settings.security', component: () => import('@/pages/settings/SecuritySettingsPage.vue') },
                    { path: 'settings/preferences', name: 'settings.preferences', component: () => import('@/pages/settings/PreferencesSettingsPage.vue') },
                    { path: 'settings/password', redirect: '/settings/security' },
                    { path: 'settings/two-factor', redirect: '/settings/security' },
                ]
            },
            { path: ':pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
        ],
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
});
