/**
 * Blog 4.1.2 Voice Player
 * Fast-streaming ElevenLabs with immediate feedback
 * Voice ID: 8Ln42OXYupYsag45MAUy
 */

class VoicePlayer {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.isLoading = false;
    this.duration = 0;
    this.progressInterval = null;
    this.mediaSource = null;
    this.sourceBuffer = null;
    this.audioChunks = [];
    
    this.voiceId = '8Ln42OXYupYsag45MAUy';
    this.apiKey = 'sk_b9487f82ad1507c97508d9b9d4a3a1fd';
    
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    this.apiBase = isLocalhost ? 'http://localhost:4005' : `http://${window.location.hostname}:4005`;
    
    this.init();
  }

  init() {
    this.wrapper = document.querySelector('.voice-player-wrapper');
    if (!this.wrapper) {
      console.error('[VoicePlayer] No wrapper found');
      return;
    }
    
    this.postId = this.wrapper.dataset.postId;
    this.postContent = this.wrapper.dataset.postContent || '';
    this.postTitle = this.wrapper.dataset.postTitle || '';
    
    this.playBtn = this.wrapper.querySelector('.voice-play-btn');
    this.progressBar = this.wrapper.querySelector('.voice-progress-bar');
    this.progressFill = this.wrapper.querySelector('.voice-progress-fill');
    this.timeDisplay = this.wrapper.querySelector('.voice-time-display');
    this.statusText = this.wrapper.querySelector('.voice-status');
    this.skipBackBtn = this.wrapper.querySelector('.voice-skip-back');
    this.skipForwardBtn = this.wrapper.querySelector('.voice-skip-forward');
    this.summarizeBtn = this.wrapper.querySelector('.voice-summarize-btn');
    
    this.bindEvents();
    console.log('[VoicePlayer] v4.1.2 initialized');
  }

  bindEvents() {
    if (!this.playBtn) return;
    
    this.playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handlePlayClick();
    });
    
    this.skipBackBtn?.addEventListener('click', () => this.skip(-10));
    this.skipForwardBtn?.addEventListener('click', () => this.skip(10));
    this.progressBar?.addEventListener('click', (e) => this.seek(e));
    this.summarizeBtn?.addEventListener('click', () => this.summarize());
    
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
        e.preventDefault();
        this.handlePlayClick();
      }
    });
  }

  async handlePlayClick() {
    if (this.isLoading) return;
    
    if (this.audio && !this.audio.ended) {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
      return;
    }
    
    await this.startPlayback();
  }

  async startPlayback(isSummary = false) {
    let text = this.postContent;
    if (!text) {
      const article = document.querySelector('.post-content');
      text = article ? article.innerText : '';
    }
    
    if (!text) {
      this.setStatus('No content to read');
      return;
    }
    
    this.isLoading = true;
    this.setLoading(true);
    this.setStatus(isSummary ? 'Creating summary...' : 'Loading audio...');
    
    try {
      // Try streaming first (fastest)
      await this.startStreaming(text, isSummary);
    } catch (err) {
      console.log('[VoicePlayer] Streaming failed, trying fetch:', err);
      try {
        await this.startFetchPlayback(text, isSummary);
      } catch (err2) {
        console.error('[VoicePlayer] Both methods failed:', err2);
        this.setStatus('Error - click to retry');
        this.isLoading = false;
        this.setLoading(false);
      }
    }
  }

  async startStreaming(text, isSummary = false) {
    // Create MediaSource for streaming
    const mediaSource = new MediaSource();
    this.mediaSource = mediaSource;
    
    this.audio = new Audio();
    this.audio.src = URL.createObjectURL(mediaSource);
    
    const chunks = [];
    let hasStarted = false;
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Stream timeout')), 10000);
      
      mediaSource.addEventListener('sourceopen', async () => {
        try {
          const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
          this.sourceBuffer = sourceBuffer;
          
          // Start fetch immediately
          const response = await fetch(`${this.apiBase}/api/tts/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: text.substring(0, 5000),
              postId: this.postId + (isSummary ? '-summary' : '')
            })
          });
          
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const reader = response.body.getReader();
          
          // Process chunks
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              clearTimeout(timeout);
              if (mediaSource.readyState === 'open') {
                try {
                  mediaSource.endOfStream();
                } catch (e) {}
              }
              break;
            }
            
            chunks.push(value);
            
            // Start playing after first few chunks (~1-2 seconds worth)
            if (!hasStarted && chunks.length >= 3) {
              hasStarted = true;
              const combined = new Blob(chunks, { type: 'audio/mpeg' });
              const buf = await combined.arrayBuffer();
              
              if (!sourceBuffer.updating) {
                sourceBuffer.appendBuffer(buf);
                
                // Start playing immediately
                this.audio.play().then(() => {
                  this.isLoading = false;
                  this.isPlaying = true;
                  this.setLoading(false);
                  this.setStatus(isSummary ? 'Playing summary' : 'Playing');
                  this.setupAudioEvents();
                  this.startProgressLoop();
                }).catch(() => {});
              }
            }
          }
          
          resolve();
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
      });
      
      mediaSource.addEventListener('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  async startFetchPlayback(text, isSummary = false) {
    const response = await fetch(`${this.apiBase}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.substring(0, 5000),
        postId: this.postId + (isSummary ? '-summary' : '')
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    this.audio = new Audio(url);
    this.setupAudioEvents();
    
    await this.audio.play();
    
    this.isLoading = false;
    this.isPlaying = true;
    this.setLoading(false);
    this.setStatus(isSummary ? 'Playing summary' : 'Playing');
    this.startProgressLoop();
  }

  setupAudioEvents() {
    if (!this.audio) return;
    
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.setLoading(false);
    });
    
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
    });
    
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.cleanup();
    });
    
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });
    
    this.audio.addEventListener('error', (e) => {
      console.error('[VoicePlayer] Audio error:', e);
      this.setStatus('Audio error');
      this.cleanup();
    });
  }

  async summarize() {
    const sentences = this.postContent
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 200)
      .slice(0, 8);
    
    const summary = `Here's a summary of ${this.postTitle || 'this post'}. ${sentences.join('. ')}.`;
    
    this.cleanup();
    this.postContent = summary;
    await this.startPlayback(true);
  }

  skip(seconds) {
    if (!this.audio) return;
    const newTime = Math.max(0, this.audio.currentTime + seconds);
    this.audio.currentTime = Math.min(newTime, this.audio.duration || newTime);
    this.updateProgress();
  }

  seek(e) {
    if (!this.audio || !this.audio.duration) return;
    const rect = this.progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    this.audio.currentTime = pct * this.audio.duration;
    this.updateProgress();
  }

  updateProgress() {
    if (!this.audio || !this.progressFill) return;
    
    const current = this.audio.currentTime || 0;
    const duration = this.audio.duration || 0;
    const pct = duration > 0 ? (current / duration) * 100 : 0;
    
    this.progressFill.style.width = `${pct}%`;
    this.timeDisplay.textContent = `${this.formatTime(current)} / ${this.formatTime(duration)}`;
  }

  startProgressLoop() {
    this.stopProgressLoop();
    this.progressInterval = setInterval(() => this.updateProgress(), 100);
  }

  stopProgressLoop() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  setLoading(loading) {
    if (!this.playBtn) return;
    
    if (loading) {
      this.playBtn.innerHTML = `
        <svg class="voice-spinner" width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
          <circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2" 
                  stroke-dasharray="60" stroke-dashoffset="20" transform="rotate(0 12 12)">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      `;
      this.playBtn.disabled = true;
      this.wrapper.classList.add('is-loading');
    } else {
      const playIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      const pauseIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
      
      this.playBtn.innerHTML = this.isPlaying ? pauseIcon : playIcon;
      this.playBtn.disabled = false;
      this.wrapper.classList.remove('is-loading');
    }
  }

  setStatus(text) {
    if (this.statusText) {
      this.statusText.textContent = text;
    }
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  cleanup() {
    this.stopProgressLoop();
    
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    
    if (this.mediaSource) {
      try {
        if (this.mediaSource.readyState === 'open') {
          this.mediaSource.endOfStream();
        }
      } catch (e) {}
      this.mediaSource = null;
    }
    
    this.sourceBuffer = null;
    this.audioChunks = [];
    this.isPlaying = false;
    this.isLoading = false;
    
    this.setLoading(false);
    this.setStatus('Listen with ElevenLabs');
    
    if (this.progressFill) this.progressFill.style.width = '0%';
    if (this.timeDisplay) this.timeDisplay.textContent = '0:00 / 0:00';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.voicePlayer = new VoicePlayer();
  });
} else {
  window.voicePlayer = new VoicePlayer();
}
