#!/bin/sh
set -eu

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY must be set before starting the application." >&2
    exit 1
fi

php artisan migrate --force
php artisan db:seed --class=InitialCategorySeeder --force
chown -R www-data:www-data storage bootstrap/cache

exec "$@"