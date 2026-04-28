@echo off
chcp 65001 >nul
echo ================================================
echo  海外实用工具推荐站 - 一键启动脚本
echo ================================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

REM 进入 site 目录
cd /d "%~dp0site"

REM 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo [信息] 首次运行，正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

echo [信息] 正在启动 Vite 开发服务器...
echo [提示] 启动后，请在浏览器访问: http://localhost:3000
echo [提示] 按 Ctrl+C 可停止服务器
echo ================================================
echo.

REM 启动开发服务器
call npm run dev

pause
