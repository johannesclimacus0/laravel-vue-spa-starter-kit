<?php

test('configured api prefix routes requests and returns json errors', function () {
    $prefix = trim((string) config('app.api_prefix'), '/');

    $this->get('/'.$prefix.'/user')->assertUnauthorized();

    $this->get('/'.$prefix.'/does-not-exist')
        ->assertNotFound()
        ->assertHeader('content-type', 'application/json')
        ->assertDontSee('id="app"', false);
});
