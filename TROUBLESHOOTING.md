# 🔧 Troubleshooting Guide

Common issues and their solutions for the TikTok Ranking Video Generator.

## Installation Issues

### Node.js/npm not installed

**Problem:** Command `node --version` returns "not found"

**Solution:**
1. Download Node.js from https://nodejs.org/ (LTS version recommended)
2. Run the installer
3. Restart terminal/command prompt
4. Verify: `node --version`

### FFmpeg not found in PATH

**Problem:** 
```
Error: Command failed: ffmpeg -version
```

**Solution:**

**Windows:**
1. Download FFmpeg from https://ffmpeg.org/download.html
2. Extract to a folder (e.g., `C:\ffmpeg`)
3. Add to PATH:
   - Right-click "This PC" → Properties → Advanced system settings
   - Environment Variables → New (User) or Edit (System)
   - Name: `PATH`
   - Add: `C:\ffmpeg\bin`
4. Restart terminal
5. Verify: `ffmpeg -version`

**macOS:**
```bash
brew install ffmpeg
ffmpeg -version  # Verify
```

**Linux:**
```bash
sudo apt-get install ffmpeg
ffmpeg -version  # Verify
```

### yt-dlp not installing

**Problem:**
```
pip is not recognized
```

**Solution:**

1. **Install Python first** from https://python.org/
2. **During installation, check "Add Python to PATH"**
3. **Install yt-dlp:**
```bash
pip3 install yt-dlp
```

Or if pip3 doesn't work:
```bash
python -m pip install yt-dlp
```

### npm install fails

**Problem:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing with legacy peer deps
npm install --legacy-peer-deps

# Or use npm 7+ force resolution
npm install --force
```

---

## Runtime Issues

### Port Already in Use

**Problem:**
```
Error: listen EADDRINUSE :::5000
```

**Solution:**

**Windows:**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Result example: TCP 0.0.0.0:5000 LISTENING 1234

# Kill process (replace 1234 with PID)
taskkill /PID 1234 /F
```

**macOS/Linux:**
```bash
# Find process
lsof -i :5000

# Kill process (replace 1234 with PID)
kill -9 1234
```

**Or use a different port:**
```bash
# Edit server/.env
PORT=5001
```

### CORS Error in Browser

**Problem:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

1. **Check if server is running** (port 5000)
2. **Verify frontend URL** matches CORS_ORIGIN
3. **Edit `server/.env`:**
```env
CORS_ORIGIN=http://localhost:3000
```

4. **Restart both frontend and backend**

### Connection Refused

**Problem:**
```
Cannot connect to http://localhost:5000
```

**Solution:**

1. **Check if backend is running:**
```bash
curl http://localhost:5000/api/health
```

2. **If not running, start it:**
```bash
cd server
npm run dev
```

3. **Check for errors in terminal**

4. **Verify firewall isn't blocking port 5000**

---

## Video Processing Issues

### FFmpeg Command Failed

**Problem:**
```
Error: Command failed: ffmpeg ...
```

**Solution:**

1. **Check FFmpeg installation:**
```bash
ffmpeg -version
```

2. **Test with a simple command:**
```bash
ffmpeg -f lavfi -i color=red:s=320x240:d=10 -pix_fmt yuv420p test.mp4
```

3. **Check disk space** for output directory
4. **Check file permissions** on temp/output folders

### TikTok Download Failed

**Problem:**
```
Failed to download TikTok video: Network timeout
```

**Solution:**

1. **Verify URL is correct:**
   - Formats: `https://www.tiktok.com/video/...` or `https://vm.tiktok.com/...`
   - Video must be public (not private)

2. **Update yt-dlp:**
```bash
pip install --upgrade yt-dlp
```

3. **Test yt-dlp directly:**
```bash
yt-dlp "https://www.tiktok.com/video/..." -f "best[ext=mp4]" -o test.mp4
```

4. **Check internet connection**

5. **If TikTok blocked yt-dlp, wait a few hours** and try again

### Out of Memory Error

**Problem:**
```
FATAL: not enough memory
```

**Solution:**

1. **Close other applications** to free RAM
2. **Reduce video dimensions in `server/.env`:**
```env
VIDEO_WIDTH=720
VIDEO_HEIGHT=1280
```

3. **Change FFmpeg preset to faster:**
```env
VIDEO_PRESET=fast
```

4. **Process fewer videos** at once

5. **Upgrade system RAM** (if consistently happening)

### Slow Video Processing

**Problem:** Taking more than 3 minutes per video

**Solution:**

1. **Use faster FFmpeg preset:**
```env
VIDEO_PRESET=fast  # Instead of medium
```

2. **Reduce video quality:**
```env
VIDEO_WIDTH=720    # Instead of 1080
VIDEO_HEIGHT=1280  # Instead of 1920
```

3. **Close other applications**

4. **Check disk I/O** - use SSD if possible

5. **Monitor CPU/RAM usage** during processing

### Video File Not Found

**Problem:**
```
Error: Cannot find output video file
```

**Solution:**

1. **Check `server/.env` output directory:**
```env
OUTPUT_DIR=./output
```

2. **Ensure directory has write permissions:**
```bash
# Windows
icacls output /grant Users:F

# macOS/Linux
chmod 755 output
```

3. **Check disk space** - need at least 500MB free

---

## Frontend Issues

### Live Preview Not Updating

**Problem:** Preview doesn't reflect text changes

**Solution:**

1. **Check browser console** for errors (F12)
2. **Refresh page** (Ctrl+R or Cmd+R)
3. **Clear browser cache** (Ctrl+Shift+Delete)
4. **Try different browser**

### Upload Button Not Working

**Problem:** Can't select or upload files

**Solution:**

1. **Check browser console** for errors
2. **Verify folder permissions** for `uploads/`
3. **Check file size** - max is 50MB
4. **Try different file format** (mp3, wav, m4a, aac)

### Progress Bar Not Moving

**Problem:** Stuck on 0% or same percentage

**Solution:**

1. **Check server terminal** for processing status
2. **Monitor backend logs** for errors
3. **Restart backend** if hung:
```bash
# Kill process and restart
npm run dev
```

### Download Link Broken

**Problem:** Download button doesn't work

**Solution:**

1. **Check if video generation completed** (status should be "completed")
2. **Verify output file exists:**
```bash
ls output/
```

3. **Check file permissions** on output directory
4. **Try right-click → Save As** instead of direct click

---

## Backend Issues

### Server Won't Start

**Problem:**
```
Error: Cannot find module 'express'
```

**Solution:**

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Clear node_modules and reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

3. **Check `package.json` exists** and is valid JSON

### API Endpoints Not Responding

**Problem:**
```
Cannot GET /api/video/generate
```

**Solution:**

1. **Check if server is running** on correct port
2. **Test health endpoint:**
```bash
curl http://localhost:5000/api/health
```

3. **Check for errors in terminal**
4. **Restart server:**
```bash
npm run dev
```

### Database Connection Failed (Future)

When database support is added:

```bash
# Check database is running
mongo --version  # For MongoDB
psql --version   # For PostgreSQL

# Verify connection string in .env
DATABASE_URL=mongodb://localhost:27017/tiktok
```

---

## Performance Issues

### Server Uses Too Much Memory

**Problem:** Server memory usage keeps growing

**Solution:**

1. **Implement garbage collection:**
```bash
node --max-old-space-size=2048 server.js
```

2. **Clean temp files regularly:**
```bash
rm -rf temp/*
```

3. **Monitor for memory leaks:**
```bash
# Use top (macOS/Linux)
top -p $(pgrep -f "node server.js")

# Or check Node.js metrics
node --inspect server.js
```

### Slow Downloads

**Problem:** Download takes too long

**Solution:**

1. **Check internet speed**
2. **Use CDN** for output files (future)
3. **Compress video** before download:
```env
VIDEO_PRESET=faster
```

---

## Browser Compatibility

### Works: ✅
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Issues on Older Browsers

**Problem:** UI doesn't load properly

**Solution:**

1. **Update browser** to latest version
2. **Clear browser cache**
3. **Try different browser**

---

## Security Issues

### Suspicious FFmpeg Command

**Problem:** Error about invalid FFmpeg parameters

**Solution:**

1. **Validate all text inputs** - special characters might break commands
2. **Escape text properly** in FFmpeg filters
3. **Never allow untrusted FFmpeg commands**

### File Upload Security

**Problem:** Concerned about malicious uploads

**Solution:**

1. **Validate file type:**
```javascript
const allowedMimes = ['audio/mpeg', 'audio/wav'];
```

2. **Limit file size:**
```env
MAX_UPLOAD_SIZE=50MB
```

3. **Scan files** with antivirus (future)
4. **Rename uploaded files** to random names

---

## Getting Help

### If this guide doesn't help:

1. **Check the logs:**
   - Browser console (F12)
   - Terminal/server logs
   - System logs

2. **Search GitHub issues**

3. **Create detailed bug report:**
   - System info (OS, Node version, FFmpeg version)
   - Steps to reproduce
   - Full error message
   - Terminal output

4. **Test with minimal example:**
   - Use simple TikTok links
   - Default settings
   - Check if custom settings cause issue

### Debugging Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check FFmpeg version
ffmpeg -version

# Check yt-dlp version
yt-dlp --version

# Check disk space
df -h (macOS/Linux) or dir (Windows)

# Check RAM usage
free -h (Linux) or top (macOS)

# Check running processes
ps aux | grep node (macOS/Linux)
tasklist | findstr node (Windows)
```

---

## Quick Reference

### Common Fixes

| Issue | Quick Fix |
|-------|-----------|
| Port in use | Change PORT in .env or kill process |
| CORS error | Restart both frontend and backend |
| FFmpeg not found | Add FFmpeg to PATH and restart |
| Download fails | Check file exists in output/ folder |
| Slow processing | Use VIDEO_PRESET=fast |
| Out of memory | Reduce VIDEO_WIDTH/HEIGHT |
| yt-dlp fails | Update with `pip install --upgrade yt-dlp` |

---

Still having issues? Check [README.md](./README.md) for more info!
