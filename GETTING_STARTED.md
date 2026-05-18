# 🚀 Getting Started Guide

## Prerequisites

Before you start, make sure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **FFmpeg** (latest version)
   - Windows: Download from https://ffmpeg.org/download.html or use `choco install ffmpeg`
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg`
   - Verify: `ffmpeg -version`

4. **Python 3** (for yt-dlp)
   - Download from: https://www.python.org/
   - Verify: `python3 --version`

5. **yt-dlp** (TikTok downloader)
   - Install: `pip3 install yt-dlp`
   - Verify: `yt-dlp --version`

## Installation Steps

### Step 1: Clone/Navigate to Project
```bash
cd strona
```

### Step 2: Run Setup Script

**Windows:**
```bash
# Using Command Prompt or PowerShell
setup.bat
```

**macOS/Linux:**
```bash
# Give execute permission (first time only)
chmod +x setup.sh

# Run setup
./setup.sh
```

The setup script will:
- ✓ Check all prerequisites
- ✓ Create necessary directories
- ✓ Install all npm dependencies
- ✓ Configure environment variables

### Step 3: Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║  TikTok Ranking Video Generator        ║
║  Server running on port 5000           ║
╚════════════════════════════════════════╝
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

Or manually:
```bash
cd client
python -m http.server 3000 --directory .
```

### Step 4: Open in Browser
- Go to: http://localhost:3000
- You should see the TikTok Ranking Video Generator interface

## First Video - Step by Step

### 1. Prepare TikTok Links
Get 5 TikTok video URLs you want to rank. You can use:
- Direct link: `https://www.tiktok.com/video/1234567890`
- Short link: `https://vm.tiktok.com/ZMxxx`

### 2. Fill in the Form
```
Ranking Title: RANKING CUTEST CATS

Video 1: https://www.tiktok.com/video/...
Video 2: https://www.tiktok.com/video/...
Video 3: https://www.tiktok.com/video/...
Video 4: https://www.tiktok.com/video/...
Video 5: https://www.tiktok.com/video/...

Labels (Optional):
1. Very Cute
2. Super Cute
3. Adorable
4. Precious
5. Cutest
```

### 3. Customize
- **Font Size**: 48 (adjust to your preference)
- **Text Color**: White (default) or your choice
- **Font**: Built-in sans-serif with bold weight

### 4. Generate
Click "Generate Video" and wait for processing (1-2 minutes)

### 5. Download
Once complete, click "Download Video"

Your 25-second ranking video is ready! 🎉

## Common Tasks

### Change Video Dimensions
Edit `server/.env`:
```env
VIDEO_WIDTH=1080      # Standard vertical
VIDEO_HEIGHT=1920     # Standard vertical (9:16)
```

### Speed Up Processing
Edit `server/.env`:
```env
VIDEO_PRESET=fast     # Faster encoding, lower quality
```

Options: `ultrafast` → `veryslow`

### Change Server Port
Edit `server/.env`:
```env
PORT=5001             # Now runs on port 5001
```

### Enable Debug Mode
Set environment variable:
```bash
NODE_ENV=development  # Already set by default
```

## Troubleshooting

### "FFmpeg not found"
```bash
# Windows: Check if FFmpeg is in PATH
ffmpeg -version

# macOS: Install with Homebrew
brew install ffmpeg

# Linux: Install with apt
sudo apt-get install ffmpeg
```

### "TikTok download failed"
- Check URL format is correct
- Ensure video is public (not private)
- Try a different video
- Update yt-dlp: `pip install --upgrade yt-dlp`

### "CORS error"
Make sure frontend and backend URLs match:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Check `.env` CORS_ORIGIN setting

### "Out of memory"
- Close other applications
- Reduce VIDEO_WIDTH and VIDEO_HEIGHT
- Change VIDEO_PRESET to `fast` or `faster`

### "Port already in use"
```bash
# Find process on port 5000 (Windows)
netstat -ano | findstr :5000

# Kill process (Windows, replace PID)
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### "Slow processing"
- Use faster FFmpeg preset: `VIDEO_PRESET=fast`
- Reduce video resolution
- Close other applications
- Check system resources

## Project Structure Reference

```
strona/
├── client/                      # Frontend files
│   ├── index.html              # Main page
│   ├── app.js                  # Frontend logic
│   ├── styles.css              # Styling
│   └── package.json
│
├── server/                      # Backend files
│   ├── server.js               # Express server
│   ├── config.js               # Configuration
│   ├── logger.js               # Logging utility
│   ├── videoUtils.js           # FFmpeg operations
│   ├── package.json
│   ├── routes/
│   │   ├── video.js            # Video API endpoints
│   │   └── upload.js           # Upload endpoints
│   │
│   └── services/
│       ├── tikTokDownloader.js # Download service
│       └── videoGenerator.js   # Composition service
│
├── uploads/                     # Uploaded files
├── output/                      # Generated videos
├── temp/                        # Temporary files
├── .env                         # Configuration
├── .env.example                 # Template
├── README.md                    # Full documentation
├── GETTING_STARTED.md          # This file
└── package.json                # Root config
```

## Development Tips

### Adding Console Logs
```javascript
// Backend
import Logger from './logger.js';
const logger = new Logger('MyModule');
logger.info('Message');
logger.error('Error message', error);
```

### Testing API Endpoints
```bash
# Get server status
curl http://localhost:5000/api/health

# Test video generation
curl -X POST http://localhost:5000/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tiktokLinks": [...],
    "bannerText": "TEST"
  }'
```

### Debug Mode
```bash
# Set in terminal before running
export NODE_ENV=development

# Then run server
npm run dev
```

## Performance Metrics

Typical processing times:

| Task | Time | Notes |
|------|------|-------|
| Download 5 videos | 30-60s | Depends on video size |
| Crop to 9:16 | 30-60s | Per video |
| Trim to 5s | 10-20s | Per video |
| Concatenate | 10-15s | All videos |
| Add overlays | 20-30s | Final composition |
| **Total** | **2-3 min** | All steps combined |

To speed up:
- Use `VIDEO_PRESET=fast` (2-3 sec faster per video)
- Reduce VIDEO_WIDTH/HEIGHT (proportional speedup)
- Use SSD for temp/output folders

## Security Best Practices

1. **Validate URLs** before processing
2. **Sanitize text** inputs for FFmpeg commands
3. **Set file upload limits** in config
4. **Use HTTPS** in production
5. **Implement rate limiting** (future)
6. **Validate file types** on upload
7. **Clean temp files** after processing

## Next Steps

1. ✅ Installation complete
2. 🎬 Generate your first video
3. 🎨 Customize styling in `client/styles.css`
4. 🔧 Adjust video settings in `server/.env`
5. 📚 Read full `README.md` for advanced features
6. 🚀 Deploy to production (future)

## Getting Help

- Check `README.md` for detailed documentation
- Review code comments in source files
- Check console for error messages
- Try different video links
- Ensure all prerequisites are installed

## What's Next?

After you get familiar with the basics:

1. **Customize Styling**
   - Edit `client/styles.css`
   - Modify colors, fonts, layout

2. **Extend Functionality**
   - Add more video effects
   - Implement background music
   - Add transitions between clips

3. **Deploy**
   - Set up on a server
   - Configure HTTPS
   - Add database support

4. **Optimize**
   - Implement caching
   - Add batch processing
   - Optimize FFmpeg settings

Happy ranking! 🎬✨
