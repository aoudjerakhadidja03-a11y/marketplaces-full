# Marketeria Local Launcher (PowerShell)
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   MARKETERIA - DEMARRAGE DE L'ENVIRONNEMENT LOCAL COMPLET" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/3] Lancement du Backend Laravel (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\marketplace-backend'; php artisan serve --host=127.0.0.1 --port=8000"

Start-Sleep -Seconds 2

Write-Host "[2/3] Lancement du Frontend React (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\marketplace-frontend'; npm run dev -- --host 127.0.0.1 --port 3000"

Start-Sleep -Seconds 3

Write-Host "`n[3/3] Serveurs en ligne !" -ForegroundColor Green
Write-Host "  - Frontend : http://localhost:3000" -ForegroundColor Cyan
Write-Host "  - Suivi des Retours : http://localhost:3000/returns" -ForegroundColor Cyan
Write-Host "  - Backend API : http://127.0.0.1:8000/api/v1" -ForegroundColor Cyan

Start-Process "http://localhost:3000/returns"
