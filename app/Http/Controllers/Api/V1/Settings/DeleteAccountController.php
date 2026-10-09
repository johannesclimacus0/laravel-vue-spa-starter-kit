<?php

namespace App\Http\Controllers\Api\V1\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class DeleteAccountController extends Controller
{
    /**
     * Delete the authenticated user's account and invalidate the session.
     */
    public function __invoke(ProfileDeleteRequest $request): Response
    {
        $user = $request->user();

        Auth::guard('web')->logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
