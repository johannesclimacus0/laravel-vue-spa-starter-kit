import type { InternalAxiosRequestConfig } from 'axios';

export type AuthSessionHandlers = {
    onUnauthenticated?: () => void;
};

export type RequestConfigWithAuthMeta = InternalAxiosRequestConfig & {
    skipAuthSessionHandlers?: boolean;
};
