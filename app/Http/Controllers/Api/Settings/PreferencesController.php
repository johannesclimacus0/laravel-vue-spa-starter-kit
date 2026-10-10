<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PreferencesController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'data' => [
                'timezone' => $request->user()->timezone,
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'timezone' => ['required', 'timezone'],
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json([
            'data' => [
                'timezone' => $user->timezone,
            ],
        ]);
    }
}
