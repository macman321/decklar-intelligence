/**
 * Blog 4.0.0 Voice Player
 * Streaming ElevenLabs TTS with playback controls
 * Voice ID: 8Ln42OXYupYsag45MAUy
 */

class VoicePlayer {
  constructor() {
    this.voiceId = '8Ln42OXYupYsag45MAUy';
    this.audioContext = null;
    this.audioBuffer = null;
    this.sourceNode = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentTime = 0;
    this.duration = 0;
    this.startTime = 0;
    this.pauseTime = 0;
    this.text = '';
    this.postId = '';
    this.mediaSource = null;
    this.audioElement = null;
    this.isStreaming = false;
    
    // UI references
    this.playerEl = null;
    this.playBtn = null;
    this.progressBar = null;
    this.timeDisplay = null;
  }

  init() {
    console.log('[VoicePlayer] Initialized v4.0.0');
    this.createPlayerUI();
  }

  createPlayerUI() {
    // Find existing player or create new one
    this.playerEl = document.querySelector('.voice-player');
    if (!this.playerEl) return;

    this.playerEl.innerHTML = `
      <div class="voice-controls">
        <button class="voice-play-btn" title="Play/Pause">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <button class="voice-summarize-btn" title="Hear Summary (60 sec)">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <span>Summary</span>
        </button>
      </div>
      <div class="voice-progress-container">
        <div class="voice-progress-bar">
          <div class="voice-progress-fill"></div>
          <div class="voice-progress-handle"></div>
        </div>
        <div class="voice-time">0:00 / 0:00</div>
      </div>
      <div class="voice-status">Listen to this post</div>
    `;

    this.playBtn = this.playerEl.querySelector('.voice-play-btn');
    this.summarizeBtn = this.playerEl.querySelector('.voice-summarize-btn');
    this.progressBar = this.playerEl.querySelector('.voice-progress-bar');
    this.progressFill = this.playerEl.querySelector('.voice-progress-fill');
    this.timeDisplay = this.playerEl.querySelector('.voice-time');
    this.statusEl = this.playerEl.querySelector('.voice-status');

    // Event listeners
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.summarizeBtn.addEventListener('click', () => this.playSummary());
    
    // Progress bar click for seeking
    this.progressBar.addEventListener('click', (e) => {
      if (!this.audioElement) return;
      const rect = this.progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      this.seek(percent * this.audioElement.duration);
    });
  }

  async togglePlay() {
    if (this.isStreaming && this.audioElement) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.resume();
      }
      return;
    }

    // Start fresh playback
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    this.text = postContent.innerText;
    this.postId = window.location.pathname.replace(/\//g, '_');
    
    this.startStreamingPlayback();
  }

  async startStreamingPlayback() {
    this.updateStatus('Connecting...');
    this.isStreaming = true;

    try {
      // Create audio element for streaming
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      
      // Set up MediaSource for streaming
      if (window.MediaSource && MediaSource.isTypeSupported('audio/mpeg')) {
        this.mediaSource = new MediaSource();
        this.audioElement.src = URL.createObjectURL(this.mediaSource);
        
        this.mediaSource.addEventListener('sourceopen', () => {
          this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg');
          this.fetchAndStreamAudio();
        });
      } else {
        // Fallback: fetch then play
        const response = await fetch('https://voice-api.decklar.io/api/tts/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: this.text, postId: this.postId })
        });
        
        const blob = await response.blob();
        this.audioElement.src = URL.createObjectURL(blob);
      }

      this.setupAudioEvents();
      this.audioElement.play();
      this.isPlaying = true;
      this.updatePlayButton();
      this.animateChatAvatar(true);
      
    } catch (error) {
      console.error('[VoicePlayer] Stream error:', error);
      this.updateStatus('Error. Try again.');
    }
  }

  async fetchAndStreamAudio() {
    try {
      const response = await fetch('https://voice-api.decklar.io/api/tts/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: this.text, postId: this.postId })
      });

      const reader = response.body.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        if (this.sourceBuffer && !this.sourceBuffer.updating) {
          this.sourceBuffer.appendBuffer(value);
        }
      }
      
      if (this.mediaSource.readyState === 'open') {
        this.mediaSource.endOfStream();
      }
    } catch (error) {
      console.error('[VoicePlayer] Stream fetch error:', error);
    }
  }

  setupAudioEvents() {
    if (!this.audioElement) return;

    this.audioElement.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentTime = 0;
      this.updatePlayButton();
      this.updateStatus('Listen to this post');
      this.animateChatAvatar(false);
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error('[VoicePlayer] Audio error:', e);
      this.updateStatus('Error. Try again.');
      this.animateChatAvatar(false);
    });
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.pauseTime = this.audioElement.currentTime;
    }
    this.isPlaying = false;
    this.isPaused = true;
    this.updatePlayButton();
    this.updateStatus('Paused');
    this.animateChatAvatar(false);
  }

  resume() {
    if (this.audioElement) {
      this.audioElement.play();
    }
    this.isPlaying = true;
    this.isPaused = false;
    this.updatePlayButton();
    this.updateStatus('Playing...');
    this.animateChatAvatar(true);
  }

  seek(time) {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
      this.updateProgress();
    }
  }

  async playSummary() {
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    const fullText = postContent.innerText;
    this.postId = window.location.pathname.replace(/\//g, '_') + '_summary';
    
    this.updateStatus('Generating summary...');
    this.isStreaming = true;

    try {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      
      // For summary, we fetch the condensed audio
      const response = await fetch('https://voice-api.decklar.io/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText, postId: this.postId })
      });
      
      const blob = await response.blob();
      this.audioElement.src = URL.createObjectURL(blob);
      
      this.setupAudioEvents();
      await this.audioElement.play();
      
      this.isPlaying = true;
      this.updatePlayButton();
      this.updateStatus('Summary (~60 sec)');
      this.animateChatAvatar(true);
      
    } catch (error) {
      console.error('[VoicePlayer] Summary error:', error);
      this.updateStatus('Error generating summary');
    }
  }

  updateProgress() {
    if (!this.audioElement) return;
    
    const current = this.audioElement.currentTime;
    const duration = this.audioElement.duration || 0;
    const percent = duration ? (current / duration) * 100 : 0;
    
    this.progressFill.style.width = percent + '%';
    this.timeDisplay.textContent = `${this.formatTime(current)} / ${this.formatTime(duration)}`;
  }

  updatePlayButton() {
    if (!this.playBtn) return;
    
    if (this.isPlaying) {
      this.playBtn.innerHTML = `
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" rx="1"/>
          <rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>
      `;
    } else {
      this.playBtn.innerHTML = `
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
    }
  }

  updateStatus(text) {
    if (this.statusEl) {
      this.statusEl.textContent = text;
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  animateChatAvatar(speaking) {
    const chatAvatar = document.getElementById('gavin-chat-avatar');
    const chatToggle = document.getElementById('gavin-chat-toggle');
    
    if (chatAvatar) {
      chatAvatar.classList.toggle('speaking', speaking);
    }
    if (chatToggle) {
      chatToggle.classList.toggle('speaking', speaking);
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.voicePlayer = new VoicePlayer();
  window.voicePlayer.init();
});
