@echo off
cd /d "%~dp0"
echo Current directory: %CD%
where docker >nul 2>&1
if %errorlevel% neq 0 (
  echo [WARN] Docker CLI not found. Falling back to local backend/frontend startup.
  call :start_local_dev
  exit /b %errorlevel%
)
where docker-compose >nul 2>&1
if %errorlevel%==0 (
  echo [INFO] Using docker-compose
  docker-compose up --build
) else (
  echo [INFO] Using docker compose
  docker compose up --build
)
exit /b 0

:start_local_dev
if not exist "%~dp0backend\requirements.txt" (
  echo [ERROR] Backend requirements not found.
  exit /b 1
)
if not exist "%~dp0frontend\package.json" (
  echo [ERROR] Frontend package.json not found.
  exit /b 1
)

start "CarDamageCalculator Backend" powershell -NoExit -Command "Set-Location -Path '%~dp0backend'; python -m pip install -r requirements.txt; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
start "CarDamageCalculator Frontend" powershell -NoExit -Command "Set-Location -Path '%~dp0frontend'; npm.cmd install; npm.cmd start"
echo [INFO] Local dev startup launched in new windows. Open http://localhost:3000 when ready.
exit /b 0
