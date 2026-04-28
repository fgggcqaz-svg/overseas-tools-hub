# 海外实用工具推荐站 - 一键启动脚本 (PowerShell 版本)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  海外实用工具推荐站 - 一键启动脚本" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
try {
    $nodeVersion = node --version
    Write-Host "[信息] Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到 Node.js，请先安装 Node.js" -ForegroundColor Red
    pause
    exit 1
}

# 进入 site 目录
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$sitePath = Join-Path $scriptPath "site"
Set-Location $sitePath

# 检查依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "[信息] 首次运行，正在安装依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 依赖安装失败" -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host "[信息] 正在启动 Vite 开发服务器..." -ForegroundColor Green
Write-Host "[提示] 启动后，请在浏览器访问: http://localhost:3000" -ForegroundColor Yellow
Write-Host "[提示] 按 Ctrl+C 可停止服务器" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 启动开发服务器
npm run dev

Write-Host ""
Write-Host "服务器已停止。" -ForegroundColor Yellow
pause
