Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SmartCity AirGuard AI - Dual Service Launcher (Windows)  " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$BackendJob = Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run_backend.ps1" -PassThru
Start-Sleep -Seconds 2
$FrontendJob = Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run_frontend.ps1" -PassThru

Write-Host "Services successfully launched:" -ForegroundColor Green
Write-Host "  - Backend API & Swagger Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "  - Frontend React Dashboard:   http://localhost:5173" -ForegroundColor Yellow
