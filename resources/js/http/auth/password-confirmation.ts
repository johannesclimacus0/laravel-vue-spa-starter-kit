import { isNormalizedApiError, normalizeApiError } from '@/http/http';
import { getSafeInternalPath } from '@/lib/navigation';
import type { Router } from 'vue-router';

function isPasswordConfirmationRequired(error: unknown): boolean {
    const normalized = isNormalizedApiError(error)
        ? error
        : normalizeApiError(error);

    return normalized.kind === 'password_confirmation';
}

export function navigateToConfirmPasswordIfRequired(
    error: unknown,
    router: Router,
    from: string,
): boolean {
    if (!isPasswordConfirmationRequired(error)) {
        return false;
    }

    const intended = getSafeInternalPath(from, '/settings/security');

    void router.replace({
        path: '/confirm-password',
        state: { from: intended },
    });

    return true;
}
