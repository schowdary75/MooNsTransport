@echo off
setlocal enabledelayedexpansion

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

set "MODE=%1"

if "%MODE%"=="" goto help
if "%MODE%"=="help" goto help
if "%MODE%"=="--help" goto help
if "%MODE%"=="-h" goto help
if "%MODE%"=="web" goto web
if "%MODE%"=="android" goto android
if "%MODE%"=="ios" goto ios
if "%MODE%"=="all" goto all

echo Unknown mode: %MODE%
goto help

:help
echo Moon local launcher (Windows)
echo.
echo Usage:
echo   start.bat web       Start Docker services, seed DB, and run the Next web app
echo   start.bat android   Build/install the Android debug app when SDK + device exist
echo   start.bat ios       Run iOS build helper (requires macOS/WSL)
echo   start.bat all       Start web stack, then build/run Android
echo.
echo Local URLs:
echo   Web:     http://localhost:3000
echo   Health:  http://localhost:3000/api/health
echo   Adminer: http://localhost:8080
echo.
echo Demo login:
echo   Rider:    demo@moon.local / demo123
echo   Admin:    admin@moon.local / admin123
echo   Operator: operator@moon.local / operator123
goto end

:web
echo Checking environment files...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo Created .env from .env.example
    )
)

if exist .env (
    echo Loading environment variables from .env...
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        set "key=%%A"
        set "val=%%B"
        if not "!key!"=="" (
            for /f "tokens=1" %%a in ("!key!") do set "key=%%a"
            set "firstchar=!key:~0,1!"
            if not "!firstchar!"=="#" (
                set "val=!val:"=!"
                set "val=!val:'=!"
                set "!key!=!val!"
            )
        )
    )
)

echo Checking node_modules...
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
if not exist apps\web\node_modules (
    echo Installing npm dependencies...
    call npm install
)

echo Starting Docker containers (mysql, redis, adminer)...
docker compose up -d mysql redis adminer
if %ERRORLEVEL% neq 0 (
    echo Docker compose failed. Make sure Docker Desktop is running.
    goto end
)

echo Applying database schema...
call npm run db:push
echo Seeding database...
call npm run db:seed

echo Starting Web server...
call npm run dev -- --filter=@moon/web
goto end

:android
echo Building and installing Android app...
cd apps\android
if exist gradlew.bat (
    call gradlew.bat :app:installDebug
) else (
    echo Gradle wrapper not found. Make sure Android SDK is configured.
)
goto end

:ios
echo iOS builds require macOS. Open apps/ios/Moon.xcodeproj on a Mac.
goto end

:all
echo Starting all stack (Web + Android)...
start "Moon Web Stack" cmd /c "%~dp0start.bat web"
timeout /t 8 >nul
echo Starting Android app installer...
call "%~dp0start.bat android"
goto end

:end
echo.
echo Launcher has stopped.
pause
