/**
 * Blog 3.0.0 Voice Comments
 * Interactive comment section with voice recording and playback
 */

class VoiceComments {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.recordedBlob = null;
    this.comments = JSON.parse(localStorage.getItem('voiceComments') || '[]');
  }

  async init() {
    this.renderCommentsSection();
    this.loadComments();
  }

  renderCommentsSection() {
    const article = document.querySelector('article.post-content');
    if (!article) return;

    const commentsSection = document.createElement('section');
    commentsSection.className = 'voice-comments-section';
    commentsSection.innerHTML = `
      <h3>Voice Discussion</h3>
      <p style="color: var(--text-secondary); font-size: 0.9rem;">
        Have thoughts? Record a voice comment or reply to join the conversation.
      </p>
      
      <div class="voice-recorder">
        <button class="voice-record-btn" id="recordBtn">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          <span id="recordBtnText">Start Recording</span>
        </button>
        
        <div class="recording-indicator" id="recordingIndicator" style="display: none;">
          <span class="recording-dot"></span>
          <span>Recording...</span>
          <span class="recording-time" id="recordingTime">0:00</span>
        </div>
        
        <div class="recording-preview" id="recordingPreview" style="display: none;">
          <div class="preview-controls">
            <button class="btn-secondary" id="playRecording">Play</button>
            <button class="btn-secondary" id="discardRecording">Discard</button>
            <button class="btn-primary" id="submitRecording">Post Comment</button>
          </div>
          <audio id="previewAudio" controls style="display: none;"></audio>
        </div>
      </div>
      
      <div class="voice-comments-list" id="commentsList">
        <!-- Comments loaded here -->
      </div>
    `;

    article.appendChild(commentsSection);
    this.attachEventListeners();
  }

  attachEventListeners() {
    const recordBtn = document.getElementById('recordBtn');
    const playBtn = document.getElementById('playRecording');
    const discardBtn = document.getElementById('discardRecording');
    const submitBtn = document.getElementById('submitRecording');

    recordBtn?.addEventListener('click', () => this.toggleRecording());
    playBtn?.addEventListener('click', () => this.playPreview());
    discardBtn?.addEventListener('click', () => this.discardRecording());
    submitBtn?.addEventListener('click', () => this.submitComment());
  }

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isRecording = true;
      this.recordingStartTime = Date.now();

      this.mediaRecorder.ondataavailable = (e) => {
        this.audioChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        this.recordedBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.showPreview();
      };

      this.mediaRecorder.start();
      this.updateRecordingUI(true);
      this.startTimer();
    } catch (error) {
      console.error('Recording failed:', error);
      alert('Microphone access required for voice comments.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.isRecording = false;
      this.updateRecordingUI(false);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.isRecording) {
        clearInterval(this.timerInterval);
        return;
      }
      const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      const timeEl = document.getElementById('recordingTime');
      if (timeEl) {
        timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  updateRecordingUI(recording) {
    const btn = document.getElementById('recordBtn');
    const btnText = document.getElementById('recordBtnText');
    const indicator = document.getElementById('recordingIndicator');

    if (recording) {
      btn.classList.add('recording');
      btnText.textContent = 'Stop Recording';
      indicator.style.display = 'flex';
    } else {
      btn.classList.remove('recording');
      btnText.textContent = 'Start Recording';
      indicator.style.display = 'none';
    }
  }

  showPreview() {
    const preview = document.getElementById('recordingPreview');
    if (preview) {
      preview.style.display = 'block';
      const audio = document.getElementById('previewAudio');
      audio.src = URL.createObjectURL(this.recordedBlob);
    }
  }

  playPreview() {
    const audio = document.getElementById('previewAudio');
    if (audio) {
      audio.style.display = 'block';
      audio.play();
    }
  }

  discardRecording() {
    this.recordedBlob = null;
    const preview = document.getElementById('recordingPreview');
    if (preview) preview.style.display = 'none';
  }

  submitComment() {
    if (!this.recordedBlob) return;

    const comment = {
      id: Date.now().toString(),
      audioUrl: URL.createObjectURL(this.recordedBlob),
      timestamp: new Date().toISOString(),
      duration: this.getDuration(),
      postId: this.getCurrentPostId()
    };

    this.comments.push(comment);
    this.saveComments();
    this.addCommentToUI(comment);
    this.discardRecording();
  }

  getDuration() {
    if (!this.recordingStartTime) return '0:00';
    const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getCurrentPostId() {
    const path = window.location.pathname;
    return path.split('/').pop().replace('.html', '') || 'unknown';
  }

  saveComments() {
    localStorage.setItem('voiceComments', JSON.stringify(this.comments));
  }

  loadComments() {
    const postId = this.getCurrentPostId();
    const postComments = this.comments.filter(c => c.postId === postId);
    postComments.forEach(comment => this.addCommentToUI(comment));
  }

  addCommentToUI(comment) {
    const list = document.getElementById('commentsList');
    if (!list) return;

    const item = document.createElement('div');
    item.className = 'voice-comment-item';
    item.innerHTML = `
      <div class="comment-avatar">
        <span>U</span>
      </div>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-author">Visitor</span>
          <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
        </div>
        <div class="comment-audio">
          <audio controls src="${comment.audioUrl}"></audio>
          <span class="comment-duration">${comment.duration}</span>
        </div>
      </div>
    `;
    list.prepend(item);
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.voiceComments = new VoiceComments();
  window.voiceComments.init();
});
