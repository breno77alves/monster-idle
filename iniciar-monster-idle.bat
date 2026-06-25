@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "HOST=127.0.0.1"
set "PORT=5173"
set "APP_URL=http://%HOST%:%PORT%/"
set "PID_FILE=.monster-idle.pid"
set "OUT_LOG=.monster-idle-server.out.log"
set "ERR_LOG=.monster-idle-server.err.log"

if not exist "package.json" (
  echo [ERRO] Execute este arquivo na pasta do Monster Idle.
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js e npm nao foram encontrados no PATH.
  exit /b 1
)

if not exist "node_modules" (
  echo [ERRO] Dependencias ausentes. Execute: npm install
  exit /b 1
)

set "EXISTING_PID="
for /f "usebackq delims=" %%P in (`powershell.exe -NoProfile -Command "$connections = @(Get-NetTCPConnection -LocalAddress '%HOST%' -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue); if ($connections.Count -gt 0) { $connections[0].OwningProcess }"`) do set "EXISTING_PID=%%P"

if defined EXISTING_PID (
  echo Monster Idle ja esta acessivel em %APP_URL% ^(PID !EXISTING_PID!^).
  if /i not "%~1"=="--no-browser" start "" "%APP_URL%"
  exit /b 0
)

del /q "%PID_FILE%" "%OUT_LOG%" "%ERR_LOG%" >nul 2>nul

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$root = (Resolve-Path '.').Path; Start-Process -FilePath 'npm.cmd' -ArgumentList @('run','dev','--','--host','%HOST%','--port','%PORT%','--strictPort') -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root '%OUT_LOG%') -RedirectStandardError (Join-Path $root '%ERR_LOG%')"
if errorlevel 1 (
  echo [ERRO] Nao foi possivel iniciar o servidor.
  exit /b 1
)

for /L %%I in (1,1,20) do (
  set "SERVER_PID="
  for /f "usebackq delims=" %%P in (`powershell.exe -NoProfile -Command "$connections = @(Get-NetTCPConnection -LocalAddress '%HOST%' -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue); if ($connections.Count -gt 0) { $connections[0].OwningProcess }"`) do set "SERVER_PID=%%P"
  if defined SERVER_PID goto server_ready
  powershell.exe -NoProfile -Command "Start-Sleep -Milliseconds 500"
)

echo [ERRO] O servidor nao respondeu. Consulte %ERR_LOG%.
exit /b 1

:server_ready
> "%PID_FILE%" echo !SERVER_PID!
echo Monster Idle iniciado em %APP_URL% ^(PID !SERVER_PID!^).
if /i not "%~1"=="--no-browser" start "" "%APP_URL%"
exit /b 0
