<?php

use App\Models\User;

test('verified users can read their time zone', function () {
    $user = User::factory()->create(['timezone' => 'Australia/Sydney']);

    $this->actingAs($user)
        ->getJson('/api/v1/settings/preferences')
        ->assertOk()
        ->assertJsonPath('data.timezone', 'Australia/Sydney');
});

test('verified users can update their time zone', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/v1/settings/preferences', ['timezone' => 'Europe/Paris'])
        ->assertOk()
        ->assertJsonPath('data.timezone', 'Europe/Paris');

    expect($user->refresh()->timezone)->toBe('Europe/Paris');
});

test('time zone updates reject invalid values', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/v1/settings/preferences', ['timezone' => 'not-a-time-zone'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('timezone');

    expect($user->refresh()->timezone)->toBe('UTC');
});

test('guests cannot access preferences', function () {
    $this->getJson('/api/v1/settings/preferences')->assertUnauthorized();
    $this->putJson('/api/v1/settings/preferences', ['timezone' => 'UTC'])->assertUnauthorized();
});

test('unverified users cannot access preferences', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/settings/preferences')
        ->assertForbidden();

    $this->putJson('/api/v1/settings/preferences', ['timezone' => 'Europe/Paris'])
        ->assertForbidden();
});
