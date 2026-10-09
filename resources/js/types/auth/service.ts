import type { User } from './index';

export type UserResponse = {
    data: User;
};

export type AuthStatusResponse = {
    status?: string;
    message?: string;
};

export type LoginResult = {
    two_factor: boolean;
};
