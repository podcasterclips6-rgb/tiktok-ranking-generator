@echo off
REM TikTok Ranking Video Generator - Setup Script for Windows
echo.
echo ╔════════════════════════════════════════╗
echo ║  TikTok Ranking Generator Setup       ║
echo ║  Windows Installation Script          ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
node --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found: 
node --version

REM Check if npm is installed
echo.
echo Checking for npm...
npm --version > nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed!
    echo Please reinstall Node.js or add npm to PATH
    pause
    exit /b 1
)
echo ✓ npm found:
npm --version

REM Check if FFmpeg is installed
echo.
echo Checking for FFmpeg...
ffmpeg -version > nul 2>&1
if errorlevel 1 (
    echo ⚠️  FFmpeg is not in PATH
    echo Please install FFmpeg from https://ffmpeg.org/download.html
    echo Add FFmpeg to your system PATH after installation
    echo.
    echo Continuing setup anyway...
) else (
    echo ✓ FFmpeg found:
    ffmpeg -version | findstr "ffmpeg version"
)

REM Check if Python is installed
echo.
echo Checking for Python...
python --version > nul 2>&1
if errorlevel 1 (
    echo ⚠️  Python is not installed
    echo Please install Python from https://www.python.org/
    echo Python is required for yt-dlp (TikTok downloader)
    echo.
    echo Continuing setup anyway...
) else (
    echo ✓ Python found:
    python --version
)

REM Check if yt-dlp is installed
echo.
echo Checking for yt-dlp...
yt-dlp --version > nul 2>&1
if errorlevel 1 (
    echo ⚠️  yt-dlp is not installed
    echo Installing yt-dlp...
    pip install yt-dlp
    if errorlevel 1 (
        echo ❌ Failed to install yt-dlp
        echo Please install manually: pip install yt-dlp
    ) else (
        echo ✓ yt-dlp installed successfully
    )
) else (
    echo ✓ yt-dlp found:
    yt-dlp --version
)

REM Create directories if they don't exist
echo.
echo Creating directories...
if not exist "uploads" mkdir uploads
if not exist "output" mkdir output
if not exist "temp" mkdir temp
echo ✓ Directories created

REM Install dependencies
echo.
echo Installing npm dependencies...
echo This may take a few minutes...
echo.

call npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

cd server
call npm install
if errorlevel 1 (
    echo ❌ Failed to install server dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

cd client
call npm install
if errorlevel 1 (
    echo ❌ Failed to install client dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ╔════════════════════════════════════════╗
echo ║  ✓ Setup Complete!                    ║
echo ╚════════════════════════════════════════╝
echo.
echo Next steps:
echo.
echo 1. Open two terminal windows
echo.
echo 2. In Terminal 1, run:
echo    cd server
echo    npm run dev
echo.
echo 3. In Terminal 2, run:
echo    cd client
echo    npm start
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo Troubleshooting:
echo - If FFmpeg is missing, download from https://ffmpeg.org/
echo - If yt-dlp fails, install with: pip install yt-dlp
echo - Make sure both FFmpeg and Python are in your PATH
echo.
pause
