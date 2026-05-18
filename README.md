# 🎬 TikTok Ranking Video Generator

A modern web application that automatically generates vertical "TikTok ranking" style videos (9:16 format) from 5 TikTok video clips. Perfect for content creators who want to make engaging ranking compilations.

## ✨ Features

- **Automatic Video Download**: Download videos directly from TikTok links
- **Automatic Video Processing**: 
  - Crops videos to 9:16 vertical format (1080x1920)
  - Trims each video to exactly 5 seconds
  - Combines into one 25-second video
- **Customizable Overlays**:
  - Editable ranking title/banner text
  - Editable ranking labels (1-5)
  - Adjustable font size and color
  - TikTok-style text styling with shadows
- **Modern UI**:
  - Drag & drop support for links
  - Live preview of your ranking
  - Real-time progress tracking
  - Dark mode with neon accents
- **Export**: Download final MP4 video
- **Professional Quality**: FFmpeg-powered video encoding

## 🏗️ Project Structure

```
strona/
├── client/                 # Frontend (HTML/CSS/JavaScript)
│   ├── index.html         # Main UI
│   ├── styles.css         # Modern styling
│   ├── app.js             # Frontend logic
│   └── package.json
├── server/                # Backend (Node.js/Express)
│   ├── server.js          # Main Express server
│   ├── videoUtils.js      # FFmpeg utilities
│   ├── package.json
│   ├── routes/
│   │   ├── video.js       # Video generation API
│   │   └── upload.js      # File upload API
│   └── services/
│       ├── tikTokDownloader.js  # TikTok video downloader
│       └── videoGenerator.js    # Video composition service
├── uploads/               # Uploaded files storage
├── output/                # Generated videos
├── temp/                  # Temporary files
├── package.json          # Root package.json
├── .env.example          # Environment template
└── README.md             # This file
```

## 📋 Requirements

### System Requirements
- **FFmpeg**: Must be installed and accessible in PATH
- **Python**: Required for yt-dlp (for downloading TikTok videos)
- **Node.js**: v16+ 
- **npm**: v7+

### Installation

#### 1. Install FFmpeg

**Windows:**
```bash
# Using chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
# Add to PATH manually
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

#### 2. Install yt-dlp (for TikTok downloads)

```bash
# Using pip
pip install yt-dlp

# Or using brew (macOS)
brew install yt-dlp
```

Verify installation:
```bash
ffmpeg -version
yt-dlp --version
```

#### 3. Clone/Setup Project

```bash
cd strona
npm install
```

This will install dependencies in root, server, and client folders.

## 🚀 Quick Start

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm install
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
# or
python -m http.server 3000 --directory .
```
Frontend will run on `http://localhost:3000`

### Production Mode

```bash
# Install all dependencies
npm run install-all

# Build frontend (if using React/Webpack)
npm run build

# Start everything
npm start
```

## 📖 Usage

1. **Open the Application**
   - Go to `http://localhost:3000`

2. **Enter TikTok Links**
   - Paste 5 TikTok video URLs
   - Format: `https://www.tiktok.com/video/...` or `https://vm.tiktok.com/...`

3. **Customize Your Ranking**
   - **Title**: Enter your ranking title (e.g., "RANKING CUTEST CATS")
   - **Labels**: Add text for each ranking (optional)
   - **Font Size**: Adjust text size (24-80)
   - **Text Color**: Choose your preferred color

4. **Generate Video**
   - Click "Generate Video"
   - Wait for processing (1-2 minutes depending on video sizes)
   - Watch the live progress bar

5. **Download**
   - Once complete, click "Download Video"
   - Your 25-second ranking video will be saved

## 🎨 Customization

### Modify Video Dimensions
Edit `.env`:
```env
VIDEO_WIDTH=1080
VIDEO_HEIGHT=1920
CLIP_DURATION=5
TOTAL_DURATION=25
```

### Change FFmpeg Preset
```env
# Options: ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow
VIDEO_PRESET=medium
```

### Styling the UI
Edit `client/styles.css` - Uses CSS custom properties for easy theme customization:
```css
--primary: #00f7ef        /* Primary color (cyan) */
--background: #0a0e27    /* Dark background */
--text: #ffffff          /* Text color */
```

## 🔧 API Endpoints

### Video Generation
```bash
POST /api/video/generate
Content-Type: application/json

{
  "tiktokLinks": [
    "https://www.tiktok.com/video/...",
    "https://www.tiktok.com/video/...",
    "https://www.tiktok.com/video/...",
    "https://www.tiktok.com/video/...",
    "https://www.tiktok.com/video/..."
  ],
  "bannerText": "RANKING CUTEST CATS",
  "rankingLabels": ["Fluffy", "Whiskers", "Mittens", "Shadow", "Patches"],
  "textColor": "#ffffff",
  "fontSize": 48
}

Response:
{
  "jobId": "uuid-here",
  "message": "Job started"
}
```

### Check Job Status
```bash
GET /api/video/status/:jobId

Response:
{
  "status": "processing",
  "progress": 45,
  "message": "Processing and composing videos...",
  "updatedAt": "2024-05-18T10:30:00Z"
}
```

### Download Video
```bash
GET /api/video/download/:jobId
```

### Upload Background Music
```bash
POST /api/upload/audio
Content-Type: multipart/form-data

file: (audio file: mp3, wav, m4a, aac)
```

## 🎯 Video Composition Details

### Format
- **Resolution**: 1080 x 1920 (9:16 vertical)
- **Duration**: 25 seconds total
- **Frame Rate**: 30 fps
- **Codec**: H.264 (libx264)

### Layout
```
┌─────────────────────────────┐
│  [RANKING TITLE BANNER]    │ ← 180px height
├─────────────────────────────┤
│  1  LABEL TEXT              │ ← Ranking 1 (5s)
│  Video content plays        │
├─────────────────────────────┤
│  2  LABEL TEXT              │ ← Ranking 2 (5s)
│  Video content plays        │
├─────────────────────────────┤
│  3  LABEL TEXT              │ ← Ranking 3 (5s)
│  Video content plays        │
├─────────────────────────────┤
│  4  LABEL TEXT              │ ← Ranking 4 (5s)
│  Video content plays        │
├─────────────────────────────┤
│  5  LABEL TEXT              │ ← Ranking 5 (5s)
│  Video content plays        │
└─────────────────────────────┘
```

### Processing Steps
1. Download videos from TikTok
2. Crop each to 9:16 format (centered)
3. Trim to exactly 5 seconds
4. Create ranking banner
5. Concatenate all videos
6. Add text overlays (title, numbers, labels)
7. Encode to MP4
8. Return download link

## 🐛 Troubleshooting

### FFmpeg not found
```bash
# Check if FFmpeg is installed
ffmpeg -version

# If not found, install it and add to PATH
# Then restart the application
```

### yt-dlp not working
```bash
# Update yt-dlp
pip install --upgrade yt-dlp

# Test download
yt-dlp --version
```

### Video download fails
- Check if TikTok links are valid and public
- Try with a different video
- Ensure internet connection is active
- Check if TikTok hasn't blocked the downloader

### Out of memory errors
- Reduce `VIDEO_WIDTH` and `VIDEO_HEIGHT` in `.env`
- Close other applications
- Ensure you have at least 2GB free RAM

### Slow processing
- Change `VIDEO_PRESET` to `fast` or `faster` (lower quality)
- Process fewer videos
- Check system resources

## 📦 Dependencies

### Backend
- **express**: Web framework
- **cors**: Cross-origin requests
- **multer**: File uploads
- **fluent-ffmpeg**: FFmpeg wrapper
- **axios**: HTTP client
- **uuid**: ID generation
- **dotenv**: Environment configuration

### Frontend
- Vanilla JavaScript (no framework required)
- Modern CSS with custom properties

### System
- **FFmpeg**: Video processing
- **yt-dlp**: TikTok downloader
- **Node.js**: Runtime
- **Python**: yt-dlp requirement

## 🎓 Code Examples

### Download a TikTok Video
```javascript
// server/services/tikTokDownloader.js
const videoPath = await downloadTikTokVideo(
  'https://www.tiktok.com/video/123456789',
  './temp/video_1.mp4'
);
```

### Trim Video to 5 Seconds
```javascript
// server/videoUtils.js
await trimVideo(
  './temp/video_1.mp4',
  './temp/trimmed_1.mp4',
  5,  // duration in seconds
  0   // start time
);
```

### Generate Ranking Video
```javascript
// server/services/videoGenerator.js
await generateRankingVideo(
  ['./temp/video_1.mp4', './temp/video_2.mp4', ...],
  './output/ranking.mp4',
  {
    bannerText: 'RANKING CUTEST CATS',
    rankingLabels: ['Fluffy', 'Whiskers', 'Mittens', 'Shadow', 'Patches'],
    textColor: '#ffffff',
    fontSize: 48
  }
);
```

## 🚀 Performance Tips

1. **Optimize Video Quality**: Lower CRF value for better quality but slower encoding
2. **Use Faster Preset**: Change to `fast` or `faster` for quicker processing
3. **Parallel Processing**: Process multiple videos in queue (future feature)
4. **Caching**: Cache downloaded videos (future feature)

## 🔐 Security Considerations

- Validate all TikTok URLs before processing
- Implement rate limiting on API endpoints
- Sanitize text inputs for FFmpeg commands
- Validate file uploads
- Use HTTPS in production
- Implement user authentication (future)
- Add CSRF protection (future)

## 📝 Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

**Default values:**
```env
PORT=5000
NODE_ENV=development
OUTPUT_DIR=./output
TEMP_DIR=./temp
UPLOADS_DIR=./uploads
VIDEO_WIDTH=1080
VIDEO_HEIGHT=1920
CLIP_DURATION=5
TOTAL_CLIPS=5
TOTAL_DURATION=25
VIDEO_CODEC=libx264
VIDEO_PRESET=medium
CORS_ORIGIN=http://localhost:3000
```

## 📄 License

MIT License - Feel free to use this project for personal or commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository.

## 🎯 Future Features

- [ ] Background music support
- [ ] Transitions between clips
- [ ] Multiple template styles
- [ ] Batch processing
- [ ] Video caching
- [ ] User authentication
- [ ] Database integration
- [ ] Advanced effects and filters
- [ ] Real-time preview
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Video analytics

## 🙏 Acknowledgments

- FFmpeg for powerful video processing
- yt-dlp for TikTok downloading capabilities
- Express.js community
- All contributors and testers

---

**Made with ❤️ by the TikTok Ranking Generator Team**

Last updated: May 18, 2024
