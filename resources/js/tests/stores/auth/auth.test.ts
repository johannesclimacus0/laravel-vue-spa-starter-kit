import { authService } from '@/services/auth/AuthService';
import { useAuthStore } from '@/stores/auth/index';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

vi.mock('@/services/auth/AuthService', () => ({
    authService: {
        fetchCurrentUser: vi.fn(),
        logout: vi.fn(),
    },
}));

const mockedFetchCurrentUser = vi.spyOn(authService, 'fetchCurrentUser');
const mockedLogout = vi.spyOn(authService, 'logout');

describe('auth store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockedFetchCurrentUser.mockReset();
        mockedLogout.mockReset();
    });

    it('bootstraps as authenticated when the current user endpoint returns a user', async () => {
        mockedFetchCurrentUser.mockResolvedValue({
            id: 1,
            name: 'Jane',
            email: 'jane@example.com',
            email_verified_at: '2026-01-01T00:00:00+00:00',
        });

        const auth = useAuthStore();
        const stop = auth.startBootstrap();

        expect(auth.isLoading).toBe(true);

        await flushPromises();

        expect(auth.isAuthenticated).toBe(true);
        expect(auth.isVerified).toBe(true);
        expect(auth.user?.email).toBe('jane@example.com');
        expect(mockedFetchCurrentUser).toHaveBeenCalledTimes(1);

        stop();
    });

    it('bootstraps as unauthenticated on guest 401/null', async () => {
        mockedFetchCurrentUser.mockResolvedValue(null);

        const auth = useAuthStore();
        auth.startBootstrap();

        await flushPromises();

        expect(auth.isAuthenticated).toBe(false);
        expect(auth.user).toBeNull();
    });

    it('clearUser and logout reset auth state', async () => {
        mockedFetchCurrentUser.mockResolvedValue({
            id: 1,
            name: 'Jane',
            email: 'jane@example.com',
            email_verified_at: null,
        });
        mockedLogout.mockResolvedValue(undefined);

        const auth = useAuthStore();
        auth.startBootstrap();
        await flushPromises();

        expect(auth.isVerified).toBe(false);

        await auth.logout();

        expect(auth.user).toBeNull();
        expect(auth.isAuthenticated).toBe(false);
        expect(mockedLogout).toHaveBeenCalledTimes(1);

        auth.setUser({
            id: 2,
            name: 'Bob',
            email: 'bob@example.com',
            email_verified_at: '2026-01-01T00:00:00+00:00',
        });
        auth.clearUser();

        expect(auth.user).toBeNull();
    });
});
