@echo off
title Frontend React Vite (Port 3000)
cd /d "%~dp0"
echo Demarrage du Frontend Vite sur http://127.0.0.1:3000...
npm run dev -- --host 127.0.0.1 --port 3000
pause
