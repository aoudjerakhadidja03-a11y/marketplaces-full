#!/bin/sh
set -eu

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY must be set before starting the application." >&2
    exit 1
fi

mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache/data storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

if [ -n "${DB_HOST:-}" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || true
    if [ "${FORCE_SEED:-false}" = "true" ]; then
        echo "Seeding database..."
        php artisan db:seed --force || true
    fi
fi

exec "$@"