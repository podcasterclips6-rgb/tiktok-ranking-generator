/**
 * TikTok Ranking Video Generator - Frontend
 * Modern web interface for video generation
 */

const API_BASE_URL = 'http://localhost:5000/api';
let currentJobId = null;
let statusCheckInterval = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    setupEventListeners();
    updatePreview();
});

/**
 * Initialize the form with 5 link input fields
 */
function initializeForm() {
    const linksContainer = document.getElementById('linksInput');
    linksContainer.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const linkInput = document.createElement('div');
        linkInput.className = 'link-input-group';
        linkInput.innerHTML = `
            <span class="link-number">${i + 1}</span>
            <input 
                type="url" 
                class="tiktok-link-input" 
                placeholder="https://www.tiktok.com/..." 
                data-index="${i}"
            >
            <button class="btn-icon" onclick="clearLink(${i})" title="Clear">×</button>
        `;
        linksContainer.appendChild(linkInput);
    }

    // Initialize ranking labels
    const labelsContainer = document.getElementById('labelsContainer');
    labelsContainer.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const labelInput = document.createElement('div');
        labelInput.className = 'label-input-group';
        labelInput.innerHTML = `
            <span class="label-rank">${i + 1}</span>
            <input 
                type="text" 
                class="ranking-label-input" 
                placeholder="e.g., Cute Cat" 
                data-index="${i}"
            >
        `;
        labelsContainer.appendChild(labelInput);
    }
}

/**
 * Setup event listeners for dynamic updates
 */
function setupEventListeners() {
    // Banner text update
    document.getElementById('bannerText').addEventListener('input', (e) => {
        updatePreview();
    });

    // Font size update
    document.getElementById('fontSize').addEventListener('input', (e) => {
        updatePreview();
    });

    // Text color update
    document.getElementById('textColor').addEventListener('input', (e) => {
        updatePreview();
    });

    // Ranking labels update
    document.querySelectorAll('.ranking-label-input').forEach((input, index) => {
        input.addEventListener('input', (e) => {
            updatePreview();
        });
    });

    // Drag and drop for links
    setupDragAndDrop();
}

/**
 * Setup drag and drop functionality
 */
function setupDragAndDrop() {
    const form = document.querySelector('.form-section');

    form.addEventListener('dragover', (e) => {
        e.preventDefault();
        form.classList.add('drag-over');
    });

    form.addEventListener('dragleave', () => {
        form.classList.remove('drag-over');
    });

    form.addEventListener('drop', (e) => {
        e.preventDefault();
        form.classList.remove('drag-over');

        const text = e.dataTransfer.getData('text/plain');
        if (text.includes('tiktok.com')) {
            addLinkToFirstEmpty(text);
        }
    });
}

/**
 * Add a link input field
 */
function addLinkInput() {
    // Find first empty input
    const inputs = document.querySelectorAll('.tiktok-link-input');
    for (const input of inputs) {
        if (!input.value) {
            input.focus();
            return;
        }
    }
    showToast('All link fields are filled!', 'info');
}

/**
 * Clear a specific link input
 */
function clearLink(index) {
    const inputs = document.querySelectorAll('.tiktok-link-input');
    if (inputs[index]) {
        inputs[index].value = '';
        inputs[index].focus();
    }
}

/**
 * Add link to first empty input
 */
function addLinkToFirstEmpty(link) {
    const inputs = document.querySelectorAll('.tiktok-link-input');
    for (const input of inputs) {
        if (!input.value) {
            input.value = link;
            updatePreview();
            return;
        }
    }
}

/**
 * Update the preview based on current form values
 */
function updatePreview() {
    const bannerText = document.getElementById('bannerText').value || 'RANKING';
    const fontSize = parseInt(document.getElementById('fontSize').value);
    const textColor = document.getElementById('textColor').value;

    // Update banner text
    document.getElementById('mockBanner').textContent = bannerText;
    document.getElementById('mockBanner').style.fontSize = `${Math.floor(fontSize * 1.5)}px`;
    document.getElementById('mockBanner').style.color = textColor;

    // Update ranking labels
    document.querySelectorAll('.ranking-label-input').forEach((input, index) => {
        const label = document.getElementById(`mockLabel${index + 1}`);
        const value = input.value || '-';
        label.textContent = value;
        label.style.fontSize = `${Math.floor(fontSize * 0.6)}px`;
        label.style.color = textColor;
    });

    // Update ranking numbers color
    document.querySelectorAll('.rank-number').forEach(elem => {
        elem.style.fontSize = `${Math.floor(fontSize * 0.8)}px`;
        elem.style.color = textColor;
    });
}

/**
 * Validate form before submission
 */
function validateForm() {
    const links = Array.from(document.querySelectorAll('.tiktok-link-input'))
        .map(input => input.value.trim())
        .filter(Boolean);

    if (links.length !== 5) {
        showToast('Please provide exactly 5 TikTok links', 'error');
        return false;
    }

    // Validate TikTok URLs
    for (const link of links) {
        if (!isValidTikTokUrl(link)) {
            showToast('Invalid TikTok URL detected', 'error');
            return false;
        }
    }

    return true;
}

/**
 * Validate TikTok URL format
 */
function isValidTikTokUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.includes('tiktok.com') || urlObj.hostname.includes('vm.tiktok.com');
    } catch {
        return false;
    }
}

/**
 * Generate the ranking video
 */
async function generateVideo() {
    // Validate form
    if (!validateForm()) {
        return;
    }

    // Get form data
    const tiktokLinks = Array.from(document.querySelectorAll('.tiktok-link-input'))
        .map(input => input.value.trim());

    const rankingLabels = Array.from(document.querySelectorAll('.ranking-label-input'))
        .map(input => input.value.trim());

    const bannerText = document.getElementById('bannerText').value || 'RANKING';
    const fontSize = parseInt(document.getElementById('fontSize').value);
    const textColor = document.getElementById('textColor').value;

    // Disable button and show progress
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = true;
    document.getElementById('progressSection').classList.remove('hidden');
    document.getElementById('downloadSection').classList.add('hidden');

    try {
        // Make API request
        const response = await fetch(`${API_BASE_URL}/video/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tiktokLinks,
                bannerText,
                rankingLabels,
                textColor,
                fontSize
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate video');
        }

        currentJobId = data.jobId;
        showToast('Video generation started!', 'success');

        // Poll for status
        pollJobStatus(currentJobId);

    } catch (error) {
        console.error('Error:', error);
        showToast(`Error: ${error.message}`, 'error');
        generateBtn.disabled = false;
        document.getElementById('progressSection').classList.add('hidden');
    }
}

/**
 * Poll job status
 */
function pollJobStatus(jobId) {
    statusCheckInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/video/status/${jobId}`);
            const data = await response.json();

            updateProgressUI(data);

            if (data.status === 'completed') {
                clearInterval(statusCheckInterval);
                onJobComplete(data);
            } else if (data.status === 'error') {
                clearInterval(statusCheckInterval);
                onJobError(data);
            }

        } catch (error) {
            console.error('Status check error:', error);
        }
    }, 1000); // Check every second
}

/**
 * Update progress UI
 */
function updateProgressUI(data) {
    const progressMessage = document.getElementById('progressMessage');
    const progressPercent = document.getElementById('progressPercent');
    const progressFill = document.getElementById('progressFill');

    progressMessage.textContent = data.message || 'Processing...';
    progressPercent.textContent = `${data.progress || 0}%`;
    progressFill.style.width = `${data.progress || 0}%`;

    // Update status badge
    const statusBadge = document.getElementById('previewStatus');
    statusBadge.textContent = data.status.toUpperCase();
    statusBadge.className = `status-badge status-${data.status}`;
}

/**
 * Handle job completion
 */
function onJobComplete(data) {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = false;

    document.getElementById('progressSection').classList.add('hidden');
    document.getElementById('downloadSection').classList.remove('hidden');

    showToast('✅ Video generated successfully!', 'success');

    // Store video URL for download
    window.videoUrl = data.videoUrl;
    window.videoJobId = data.jobId;
}

/**
 * Handle job error
 */
function onJobError(data) {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = false;

    document.getElementById('progressSection').classList.add('hidden');
    showToast(`❌ Error: ${data.message}`, 'error');
}

/**
 * Download the generated video
 */
function downloadVideo() {
    if (!window.videoJobId) {
        showToast('No video available for download', 'error');
        return;
    }

    const downloadLink = `${API_BASE_URL}/video/download/${window.videoJobId}`;
    const a = document.createElement('a');
    a.href = downloadLink;
    a.download = `ranking-video-${window.videoJobId}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast('Download started!', 'success');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/**
 * Utility: Format time
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Export for testing
window.app = {
    generateVideo,
    validateForm,
    updatePreview
};
