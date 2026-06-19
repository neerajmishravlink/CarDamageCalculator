@echo off
cd /d "%~dp0\.."
echo Delegating to root start-stack.cmd in %CD%
if exist start-stack.cmd (
  call start-stack.cmd
) else (
  echo [ERROR] Root start-stack.cmd not found in %CD%
  exit /b 1
)
