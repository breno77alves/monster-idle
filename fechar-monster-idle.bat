@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "HOST=127.0.0.1"
set "PORT=5173"
set "PID_FILE=.monster-idle.pid"

if not exist "%PID_FILE%" (
  echo Nenhum servidor iniciado por iniciar-monster-idle.bat foi encontrado.
  exit /b 0
)

set /p SERVER_PID=<"%PID_FILE%"
set "MONSTER_IDLE_PID=%SERVER_PID%"

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$serverProcessId = 0; if (-not [int]::TryParse($env:MONSTER_IDLE_PID, [ref]$serverProcessId)) { exit 3 }; $ownsPort = $false; $connections = @(Get-NetTCPConnection -LocalAddress '%HOST%' -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue); foreach ($connection in $connections) { if ($connection.OwningProcess -eq $serverProcessId) { $ownsPort = $true } }; if (-not $ownsPort) { exit 2 }; Stop-Process -Id $serverProcessId -Force"
set "STOP_RESULT=%ERRORLEVEL%"

if "%STOP_RESULT%"=="0" (
  del /q "%PID_FILE%" >nul 2>nul
  echo Servidor Monster Idle encerrado ^(PID %SERVER_PID%^).
  exit /b 0
)

if "%STOP_RESULT%"=="2" (
  del /q "%PID_FILE%" >nul 2>nul
  echo O processo registrado nao controla mais a porta %PORT%. Registro antigo removido.
  exit /b 0
)

echo [ERRO] O arquivo %PID_FILE% contem um PID invalido.
exit /b 1
