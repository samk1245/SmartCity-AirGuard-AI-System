Write-Host "Starting SmartCity AirGuard AI Frontend on http://localhost:5173..." -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot\frontend
npm run dev
