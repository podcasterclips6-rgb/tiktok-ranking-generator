# API Documentation

Complete API reference for TikTok Ranking Video Generator

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Health Check
Check if the server is running.

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### 2. Generate Video
Start a video generation job with TikTok links.

**Request:**
```http
POST /video/generate
Content-Type: application/json

{
  "tiktokLinks": [
    "https://www.tiktok.com/video/1234567890",
    "https://www.tiktok.com/video/1234567891",
    "https://www.tiktok.com/video/1234567892",
    "https://www.tiktok.com/video/1234567893",
    "https://www.tiktok.com/video/1234567894"
  ],
  "bannerText": "RANKING CUTEST CATS",
  "rankingLabels": [
    "Very Cute",
    "Super Cute",
    "Adorable",
    "Precious",
    "Cutest"
  ],
  "textColor": "#ffffff",
  "fontSize": 48,
  "backgroundColor": "#1a1a1a"
}
```

**Response (201 Created):**
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Job started"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| tiktokLinks | array | Yes | Array of exactly 5 TikTok URLs | - |
| bannerText | string | No | Title text for the video | "RANKING" |
| rankingLabels | array | No | Array of 5 labels for rankings | [] |
| textColor | string | No | Hex color for text | "#ffffff" |
| fontSize | number | No | Font size in pixels | 48 |
| backgroundColor | string | No | Hex color for background | "#1a1a1a" |

**Error Responses:**

```json
{
  "status": 400,
  "error": "Exactly 5 TikTok links are required"
}
```

```json
{
  "status": 500,
  "error": "Internal Server Error"
}
```

---

### 3. Get Job Status
Check the status of a video generation job.

**Request:**
```http
GET /video/status/{jobId}
```

**Response:**
```json
{
  "status": "processing",
  "progress": 65,
  "message": "Processing and composing videos...",
  "createdAt": "2024-05-18T10:30:00Z",
  "updatedAt": "2024-05-18T10:31:30Z"
}
```

**Status Values:**

| Status | Meaning | Progress |
|--------|---------|----------|
| initializing | Job being prepared | 0% |
| downloading | Downloading TikTok videos | 5-80% |
| processing | Processing and composing videos | 80-95% |
| completed | Video ready for download | 100% |
| error | Job failed | 0% |

**Completed Response:**
```json
{
  "status": "completed",
  "progress": 100,
  "message": "Video generated successfully",
  "outputFile": "/path/to/output/550e8400-e29b-41d4-a716-446655440000.mp4",
  "videoUrl": "/output/550e8400-e29b-41d4-a716-446655440000.mp4"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Failed to download video 1: Network timeout",
  "error": true
}
```

---

### 4. Download Video
Download the generated video file.

**Request:**
```http
GET /video/download/{jobId}
```

**Response:**
- Content-Type: `video/mp4`
- Binary video file

**Headers:**
```
Content-Disposition: attachment; filename="ranking-video-550e8400-e29b-41d4-a716-446655440000.mp4"
Content-Type: video/mp4
Content-Length: 15728640
```

**Error Response (404):**
```json
{
  "status": 404,
  "error": "Job not found"
}
```

**Error Response (400):**
```json
{
  "status": 400,
  "error": "Video not ready yet"
}
```

---

### 5. Upload Audio (Future Feature)
Upload background music for the video.

**Request:**
```http
POST /upload/audio
Content-Type: multipart/form-data

file: [audio file]
```

**Supported Formats:**
- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- AAC (.aac)

**Maximum Size:** 50MB

**Response:**
```json
{
  "success": true,
  "file": {
    "filename": "abc123def456.mp3",
    "originalName": "background-music.mp3",
    "path": "/uploads/abc123def456.mp3",
    "size": 5242880,
    "mimetype": "audio/mpeg"
  }
}
```

---

## Examples

### cURL

**Generate Video:**
```bash
curl -X POST http://localhost:5000/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tiktokLinks": [
      "https://www.tiktok.com/video/1234567890",
      "https://www.tiktok.com/video/1234567891",
      "https://www.tiktok.com/video/1234567892",
      "https://www.tiktok.com/video/1234567893",
      "https://www.tiktok.com/video/1234567894"
    ],
    "bannerText": "TOP 5 CATS",
    "rankingLabels": ["1", "2", "3", "4", "5"]
  }'
```

**Check Status:**
```bash
curl http://localhost:5000/api/video/status/550e8400-e29b-41d4-a716-446655440000
```

**Download Video:**
```bash
curl http://localhost:5000/api/video/download/550e8400-e29b-41d4-a716-446655440000 \
  -o ranking-video.mp4
```

### JavaScript/Fetch

**Generate Video:**
```javascript
const response = await fetch('http://localhost:5000/api/video/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tiktokLinks: [
      'https://www.tiktok.com/video/...',
      // ... 5 total
    ],
    bannerText: 'TOP 5 CATS',
    rankingLabels: ['Fluffy', 'Whiskers', 'Mittens', 'Shadow', 'Patches']
  })
});

const data = await response.json();
const jobId = data.jobId;
```

**Poll Status:**
```javascript
const pollStatus = async (jobId) => {
  while (true) {
    const response = await fetch(`http://localhost:5000/api/video/status/${jobId}`);
    const data = await response.json();
    
    console.log(`Status: ${data.status} - ${data.progress}%`);
    
    if (data.status === 'completed') {
      return data.videoUrl;
    } else if (data.status === 'error') {
      throw new Error(data.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

const videoUrl = await pollStatus(jobId);
```

### Python

**Generate Video:**
```python
import requests
import json

url = 'http://localhost:5000/api/video/generate'
data = {
    'tiktokLinks': [
        'https://www.tiktok.com/video/...',
        # ... 5 total
    ],
    'bannerText': 'TOP 5 CATS',
    'rankingLabels': ['Fluffy', 'Whiskers', 'Mittens', 'Shadow', 'Patches']
}

response = requests.post(url, json=data)
job_id = response.json()['jobId']
```

**Check Status:**
```python
import time

def wait_for_completion(job_id):
    while True:
        response = requests.get(f'http://localhost:5000/api/video/status/{job_id}')
        data = response.json()
        
        print(f"Status: {data['status']} - {data['progress']}%")
        
        if data['status'] == 'completed':
            return data['videoUrl']
        elif data['status'] == 'error':
            raise Exception(data['message'])
        
        time.sleep(1)

video_url = wait_for_completion(job_id)
```

---

## Error Handling

### Common Error Codes

| Code | Error | Solution |
|------|-------|----------|
| 400 | Bad Request | Check request format and parameters |
| 404 | Not Found | Job ID doesn't exist or video not found |
| 500 | Internal Error | Check server logs |
| 503 | Service Unavailable | Server is down or overloaded |

### Error Response Format

```json
{
  "status": 400,
  "error": "Error message",
  "message": "Detailed explanation"
}
```

---

## Rate Limiting

Currently no rate limiting implemented. In production, add:
- Max requests per minute per IP
- Max concurrent jobs per user
- Timeout for long-running jobs

---

## CORS

Cross-Origin requests are allowed from:
```
http://localhost:3000
```

Configure in `.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

---

## Authentication

Currently no authentication required. Add in production:
- API key authentication
- JWT tokens
- OAuth2
- Rate limiting per user

---

## Versioning

Current API version: **v1**

Future versions may be available at:
```
/api/v2/...
```

---

## Rate Limits (Future)

Planning to implement:
- 100 requests/minute per IP
- 5 concurrent jobs per IP
- 1GB total output per day per IP

---

## WebSocket Support (Future)

Real-time progress updates via WebSocket:
```javascript
const ws = new WebSocket('ws://localhost:5000/stream/job/550e8400-e29b-41d4-a716-446655440000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`Progress: ${data.progress}%`);
};
```

---

## Webhook Support (Future)

Receive status updates via webhook:
```bash
POST /api/video/generate
{
  "tiktokLinks": [...],
  "webhookUrl": "https://myapp.com/webhook/video-complete"
}
```

The server will POST to your webhook when complete:
```json
{
  "jobId": "...",
  "status": "completed",
  "videoUrl": "/output/..."
}
```

---

For more information, see [README.md](./README.md)
