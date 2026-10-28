@echo off
title City Care Hospital - DBMS Project
cd /d "%~dp0"
echo.
echo  ====================================================
echo   CITY CARE HOSPITAL - starting server...
echo   Open http://localhost:8000 in your browser
echo   Press Ctrl+C in this window to stop the server
echo  ====================================================
echo.
where python >nul 2>nul
if %errorlevel%==0 (
    python server.py
) else (
    echo  ERROR: Python not found.
    echo  Install Python from https://www.python.org/downloads/
    echo  and tick "Add Python to PATH" during installation.
)
pause
