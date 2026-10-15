@echo off
title Marketeria - Demarrage Local (Backend + Frontend)
color 0A
echo ======================================================================
echo    MARKETERIA - DEMARRAGE DE L'ENVIRONNEMENT LOCAL COMPLET
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Verification des ports 8000 et 3000...
echo.

echo [2/3] Lancement du Backend Laravel (Port 8000)...
start "Marketeria Backend (Laravel 8000)" cmd /k "cd /d "%~dp0marketplace-backend" && php artisan serve --host=127.0.0.1 --port=8000"

timeout /t 2 /nobreak >nul

echo [3/3] Lancement du Frontend React Vite (Port 3000)...
start "Marketeria Frontend (Vite 3000)" cmd /k "cd /d "%~dp0marketplace-frontend" && npm run dev -- --host 127.0.0.1 --port 3000"

timeout /t 3 /nobreak >nul

echo.
echo ======================================================================
echo   SERVEURS DEMARRES AVEC SUCCES !
echo   - Frontend: http://localhost:3000
echo   - Suivi Retours: http://localhost:3000/returns
echo   - Backend API: http://127.0.0.1:8000/api/v1
echo ======================================================================
echo.
echo Ouverture automatique de votre navigateur dans 2 secondes...
timeout /t 2 /nobreak >nul
start http://localhost:3000/returns

pause
