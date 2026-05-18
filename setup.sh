#!/bin/bash
# TikTok Ranking Video Generator - Setup Script for macOS/Linux

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  TikTok Ranking Generator Setup       ║"
echo "║  macOS/Linux Installation Script      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
echo "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js found: $(node --version)"

# Check if npm is installed
echo ""
echo "Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "Please reinstall Node.js"
    exit 1
fi
echo "✓ npm found: $(npm --version)"

# Check if FFmpeg is installed
echo ""
echo "Checking for FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg is not installed"
    echo "Installing FFmpeg..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew &> /dev/null; then
            echo "Homebrew not found. Please install from https://brew.sh"
            exit 1
        fi
        brew install ffmpeg
    else
        # Linux
        sudo apt-get update
        sudo apt-get install -y ffmpeg
    fi
else
    echo "✓ FFmpeg found: $(ffmpeg -version | head -n 1)"
fi

# Check if Python is installed
echo ""
echo "Checking for Python..."
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 is not installed"
    echo "Installing Python..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install python3
    else
        # Linux
        sudo apt-get install -y python3
    fi
else
    echo "✓ Python found: $(python3 --version)"
fi

# Check if yt-dlp is installed
echo ""
echo "Checking for yt-dlp..."
if ! command -v yt-dlp &> /dev/null; then
    echo "⚠️  yt-dlp is not installed"
    echo "Installing yt-dlp..."
    pip3 install yt-dlp
else
    echo "✓ yt-dlp found: $(yt-dlp --version)"
fi

# Create directories
echo ""
echo "Creating directories..."
mkdir -p uploads output temp
echo "✓ Directories created"

# Install dependencies
echo ""
echo "Installing npm dependencies..."
echo "This may take a few minutes..."
echo ""

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi
cd ..

cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
cd ..

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✓ Setup Complete!                    ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Open two terminal windows"
echo ""
echo "2. In Terminal 1, run:"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "3. In Terminal 2, run:"
echo "   cd client"
echo "   npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
