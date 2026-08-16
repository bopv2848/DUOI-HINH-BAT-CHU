@echo off
chcp 65001 >nul
title DAY CODE DUOI HINH BAT CHU LEN GITHUB
color 0A
echo ======================================================================
echo   DANG TIEN HANH DAY MA NGUON DUOI HINH BAT CHU LEN GITHUB...
echo ======================================================================
echo.
cd /d "%~dp0"
git status
echo.
echo Dang day code len nhanh main (origin)...
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ======================================================================
    echo   [THANH CONG] DA DAY TOAN BO DU LIEU LEN GITHUB CHINH XAC 100%!
    echo ======================================================================
) else (
    echo ======================================================================
    echo   [THONG BAO] Vui long bam dang nhap tren trinh duyet neu duoc yeu cau.
    echo ======================================================================
)
echo.
pause
