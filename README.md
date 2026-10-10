# Laravel Vue SPA Starter

A starting point for my Laravel projects with a Vue SPA frontend.

This repository is a fork of [muradyanvano/laravel-vue-spa-starter-kit](https://github.com/muradyanvano/laravel-vue-spa-starter-kit).

## Start a new project

```bash
git clone https://github.com/johannesclimacus0/laravel-vue-spa-starter-kit.git appname
cd appname
git remote rename origin source
git remote add origin git@github.com:YOUR_USERNAME/my-app.git

git switch --orphan clean-main
git restore --source=source/main --staged --worktree .
git commit -m "Initial commit"
git push -u origin clean-main:main
```

### Requirements

- PHP 8.5 with Composer
- Node.js 22 or 24 with npm
- Docker with Compose

### First run with Sail

```bash
composer install
cp .env.example .env
php artisan key:generate
npm ci
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
npm run dev
```

The Sail stack includes PostgreSQL, Redis, Mailpit, Horizon, Reverb, and a scheduler.

## Features

- Auth: Fortify, Sanctum, registration, login, password reset, email verification, 2FA, recovery codes
- Settings: profile, password, security, time zone, account deletion
- Frontend: Vue 3, TypeScript, Vue Router, Pinia, Axios, Tailwind CSS, Wayfinder
- Realtime: Reverb and Echo configuration
- Checks: Pest, Vitest, PHPStan, Pint, CI

## Credits

Based on [muradyanvano/laravel-vue-spa-starter-kit](https://github.com/muradyanvano/laravel-vue-spa-starter-kit).
