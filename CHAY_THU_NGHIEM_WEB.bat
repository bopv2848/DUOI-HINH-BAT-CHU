@echo off
chcp 65001 >nul
title MAY CHU KIEM THU WEB TRO CHOI DUOI HINH BAT CHU
color 0B
echo ======================================================================
echo   DANG KHOI DONG MAY CHU KIEM THU WEB TRO CHOI DUOI HINH BAT CHU...
echo ======================================================================
echo.
cd /d "%~dp0"
echo Dang mo trinh duyet web http://localhost:3000...
start http://localhost:3000
echo.
npm run dev
pause
