import {
    isRequestAborted,
    setAuthSessionHandlersSuppressed,
} from '@/http/http';
import { authService } from '@/services/auth/AuthService';
import type { AuthStatus, User } from '@/types/auth/index';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const status = ref<AuthStatus>('loading');

    const setUser = (nextUser: User | null): void => {
        user.value = nextUser;
        status.value = nextUser ? 'authenticated' : 'unauthenticated';
    };

    const clearUser = (): void => {
        setUser(null);
    };

    const refreshUser = async (): Promise<User | null> => {
        try {
            const nextUser = await authService.fetchCurrentUser();
            setUser(nextUser);

            return nextUser;
        } catch (error) {
            if (isRequestAborted(error)) {
                return null;
            }

            setUser(null);

            return null;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    const startBootstrap = (): (() => void) => {
        const controller = new AbortController();
        let active = true;

        setAuthSessionHandlersSuppressed(true);

        void (async () => {
            try {
                const nextUser = await authService.fetchCurrentUser({
                    signal: controller.signal,
                });

                if (!active) {
                    return;
                }

                setUser(nextUser);
            } catch (error) {
                if (!active || isRequestAborted(error)) {
                    return;
                }

                setUser(null);
            } finally {
                if (active) {
                    setAuthSessionHandlersSuppressed(false);
                }
            }
        })();

        return () => {
            active = false;
            controller.abort();
            setAuthSessionHandlersSuppressed(false);
        };
    };

    return {
        user,
        status,
        isAuthenticated: computed(() => status.value === 'authenticated'),
        isLoading: computed(() => status.value === 'loading'),
        isVerified: computed(
            () => user.value !== null && user.value.email_verified_at !== null,
        ),
        refreshUser,
        setUser,
        clearUser,
        logout,
        startBootstrap,
    };
});
