# Laravel Vue SPA Starter

A starting point for my Laravel projects with a Vue SPA frontend.

This repository is a fork of [muradyanvano/laravel-vue-spa-starter-kit](https://github.com/muradyanvano/laravel-vue-spa-starter-kit).

## Start a new project

### Option 1: Use the template

1. Click **Use this template → Create a new repository** on this repository's GitHub page.
2. Choose a name for your project and create the repository.
3. Clone your new repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
cd YOUR_PROJECT
```

Your project starts with one commit containing the starter files.

### Option 2: Clone with full history

```bash
git clone https://github.com/johannesclimacus0/laravel-vue-spa-starter-kit.git YOUR_PROJECT
cd YOUR_PROJECT
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_PROJECT.git
git push -u origin main
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
