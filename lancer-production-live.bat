@echo off
title Marketeria - Serveur Live Production (Cloudflare + Laravel + MySQL)
color 0B
echo ======================================================================
echo    MARKETERIA - SERVEUR CLOUD PUBLIC CONNECTE A VERCEL
echo ======================================================================
echo.
echo URL Publique Vercel : https://marketplace-frontend-aoudjera-khadidja.vercel.app
echo API Backend Cloud   : https://reconstruction-vessels-bras-knows.trycloudflare.com/api/v1
echo.
echo ======================================================================

cd /d "%~dp0"

echo [1/3] Demarrage / Verification de MySQL...
net start MySQL >nul 2>&1

echo [2/3] Demarrage du Backend Laravel (Port 8000)...
start "Marketeria Backend (Laravel 8000)" /min cmd /c "cd /d "%~dp0marketplace-backend" && C:\xampp\php\php.exe artisan serve --host=127.0.0.1 --port=8000"

timeout /t 2 /nobreak >nul

echo [3/3] Demarrage du Tunnel Cloudflare Haute Vitesse...
start "Marketeria Cloudflare Tunnel" /min cmd /c "cd /d "%~dp0" && "%~dp0cloudflared.exe" tunnel --url http://127.0.0.1:8000"

timeout /t 3 /nobreak >nul

echo.
echo ======================================================================
echo   TOUT EST EN LIGNE ET SYNCHRONISE !
echo   Le site est accessible partout dans le monde via le lien Vercel.
echo ======================================================================
echo.
echo Ouverture du site dans votre navigateur...
start https://marketplace-frontend-aoudjera-khadidja.vercel.app

pause
