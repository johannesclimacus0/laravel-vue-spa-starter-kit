<?php

use App\Models\User;
use Illuminate\Support\Facades\Schema;

test('passkey storage is removed', function () {
    expect(Schema::hasTable('passkeys'))->toBeFalse();
});

test('authenticated verified users can fetch security settings', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/settings/security')
        ->assertOk()
        ->assertJsonPath('data.canManageTwoFactor', true)
        ->assertJsonPath('data.twoFactorEnabled', false)
        ->assertJsonPath('data.requiresConfirmation', true)
        ->assertJsonStructure(['data' => ['passwordRules']])
        ->assertJsonMissingPath('data.canManagePasskeys');
});

test('security settings report enabled two-factor status', function () {
    $user = User::factory()->withTwoFactor()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/settings/security')
        ->assertOk()
        ->assertJsonPath('data.twoFactorEnabled', true);
});

test('guests cannot fetch security settings', function () {
    $this->getJson('/api/v1/settings/security')->assertUnauthorized();
});

test('unverified users cannot fetch security settings', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/settings/security')
        ->assertForbidden();
});
