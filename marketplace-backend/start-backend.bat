@echo off
title Backend Laravel (Port 8000)
cd /d "%~dp0"
echo Demarrage du Backend Laravel sur http://127.0.0.1:8000...
php artisan serve --host=127.0.0.1 --port=8000
pause
