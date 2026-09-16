@echo off
title Plantilla de sitios - no cierres esta ventana
cd /d "%~dp0"
echo.
echo  Encendiendo la plantilla...
echo  La primera carga tarda 1 o 2 minutos. No cierres esta ventana.
echo.
echo  Sitio:  http://localhost:3000
echo  Panel:  http://localhost:3000/admin
echo.
start "" cmd /c "timeout /t 60 >nul & start http://localhost:3000/admin"
npm run dev
pause
