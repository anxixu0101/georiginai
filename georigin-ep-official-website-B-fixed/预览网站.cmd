@echo off
cd /d "%~dp0georigin-ep-official-website"
if not exist node_modules\vite\bin\vite.js (
  call npm.cmd ci --no-audit --no-fund
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo Open the Local URL printed below in your browser.
echo Keep this window open. Press Ctrl+C to stop.
call npm.cmd run dev -- --host 127.0.0.1
pause
