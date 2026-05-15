/**
 * Blog 3.0.0 Voice Player
 * ElevenLabs integration for reading posts aloud
 * Features: Streaming TTS, Playback Controls, Summarize
 * Voice ID: 8Ln42OXYupYsag45MAUy
 */

class VoicePlayer {
  constructor() {
    this.voiceId = '8Ln42OXYupYsag45MAUy';
    this.apiKey = null;
    this.audioCache = new Map();
    this.audioElement = null;
    this.isPlaying = false;
    this.isGenerating = false;
    this.isStreaming = false;
    this.currentTime = 0;
    this.duration = 0;
    this.fullPostContent = '';
    this.postId = null;
    this.isPaused = false;
    this.proxyUrl = 'http://localhost:4005/api/tts';
    this.streamUrl = 'http://localhost:4005/api/tts/stream';
    this.summarizeUrl = 'http://localhost:4005/api/summarize';
  }

  async init(apiKey) {
    this.apiKey = apiKey;
    console.log('[VoicePlayer] Initialized with streaming support');
  }

  /**
   * Stream audio directly without waiting for full file
   */
  async streamAudio(text, postId) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      this.audioElement = audio;
      this.postId = postId;
      this.fullPostContent = text;
      
      // Use MediaSource for streaming playback
      if (window.MediaSource && MediaSource.isTypeSupported('audio/mpeg')) {
        this.setupMediaSourceStreaming(text, postId, audio, resolve, reject);
      } else {
        // Fallback for older browsers
        this.setupFetchStreaming(text, postId, audio, resolve, reject);
      }
    });
  }

  setupMediaSourceStreaming(text, postId, audio, resolve, reject) {
    const mediaSource = new MediaSource();
    this.mediaSource = mediaSource;
    audio.src = URL.createObjectURL(mediaSource);
    
    let bufferQueue = [];
    let sourceBuffer = null;
    let streamEnded = false;

    mediaSource.addEventListener('sourceopen', async () => {
      try {
        sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        
        // Handle buffer updates
        sourceBuffer.addEventListener('updateend', () => {
          if (bufferQueue.length > 0 && !sourceBuffer.updating) {
            const chunk = bufferQueue.shift();
            sourceBuffer.appendBuffer(chunk);
          } else if (streamEnded && bufferQueue.length === 0 && !sourceBuffer.updating) {
            if (mediaSource.readyState === 'open') {
              mediaSource.endOfStream();
            }
          }
        });

        // Start fetching stream
        const response = await fetch(this.streamUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, postId })
        });

        if (!response.ok) {
          throw new Error(`Stream error: ${response.status}`);
        }

        const reader = response.body.getReader();
        this.isStreaming = true;
        this.isGenerating = false;
        this.updateUIState('playing');

        // Start reading stream chunks
        while (this.isStreaming) {
          const { done, value } = await reader.read();
          
          if (done) {
            streamEnded = true;
            if (bufferQueue.length === 0 && !sourceBuffer.updating) {
              if (mediaSource.readyState === 'open') {
                mediaSource.endOfStream();
              }
            }
            break;
          }

          // Queue chunks
          if (sourceBuffer.updating) {
            bufferQueue.push(value);
          } else {
            try {
              sourceBuffer.appendBuffer(value);
            } catch (e) {
              bufferQueue.push(value);
            }
          }
        }

        resolve(audio);
      } catch (error) {
        console.error('[VoicePlayer] MediaSource error:', error);
        reject(error);
      }
    });

    // Handle playback end
    audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentTime = 0;
      this.updateUIState('idle');
    });

    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime;
      this.updateProgressBar();
    });

    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration)) {
        this.duration = audio.duration;
        this.updateProgressBar();
      }
    });

    // Start playing immediately
    audio.play().catch(err => {
      console.error('[VoicePlayer] Play error:', err);
      reject(err);
    });
  }

  setupFetchStreaming(text, postId, audio, resolve, reject) {
    // Fallback: Fetch entire audio then play
    fetch(this.streamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, postId })
    })
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      audio.src = url;
      
      audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentTime = 0;
        this.updateUIState('idle');
      });

      audio.addEventListener('timeupdate', () => {
        this.currentTime = audio.currentTime;
        this.updateProgressBar();
      });

      audio.play().then(() => resolve(audio)).catch(reject);
      this.isGenerating = false;
      this.updateUIState('playing');
    })
    .catch(reject);
  }

  /**
   * Generate summary and play it (~150 words, ~60 seconds)
   */
  async playSummary(postId, text) {
    if (this.isGenerating) {
      console.log('[VoicePlayer] Already generating, please wait...');
      return;
    }

    this.isGenerating = true;
    this.updateUIState('generating-summary');

    try {
      // Clear any existing audio
      this.stop();

      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      this.audioElement = audio;
      this.postId = postId + '-summary';
      this.fullPostContent = text;
      this.isStreaming = true;
      this.isPlaying = true;

      const response = await fetch(this.summarizeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, postId })
      });

      if (!response.ok) {
        throw new Error(`Summary stream error: ${response.status}`);
      }

      // Stream to blob and play
      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      audio.src = url;

      audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentTime = 0;
        this.updateUIState('idle');
      });

      audio.addEventListener('timeupdate', () => {
        this.currentTime = audio.currentTime;
        this.updateProgressBar();
      });

      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && !isNaN(audio.duration)) {
          this.duration = audio.duration;
        }
      });

      await audio.play();
      this.isGenerating = false;
      this.updateUIState('playing-summary');

    } catch (error) {
      console.error('[VoicePlayer] Summary error:', error);
      this.isGenerating = false;
      this.isPlaying = false;
      this.updateUIState('error');
    }
  }

  /**
   * Play audio for a post (uses streaming)
   */
  async play(postId, text) {
    // Toggle play/pause
    if (this.isPlaying && this.postId === postId) {
      this.pause();
      return;
    }

    // Resume from pause
    if (this.isPaused && this.postId === postId && this.audioElement) {
      this.resume();
      return;
    }

    // New playback
    if (this.isPlaying) {
      this.stop();
    }

    this.postId = postId;
    this.fullPostContent = text;
    this.isGenerating = true;
    this.updateUIState('generating');

    try {
      await this.streamAudio(text, postId);
      this.isPlaying = true;
    } catch (error) {
      console.error('[VoicePlayer] Play failed:', error);
      this.isGenerating = false;
      this.isPlaying = false;
      this.updateUIState('error');
    }
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPaused = true;
      this.isPlaying = false;
      this.updateUIState('paused');
    }
  }

  resume() {
    if (this.audioElement) {
      this.audioElement.play();
      this.isPaused = false;
      this.isPlaying = true;
      this.updateUIState('playing');
    }
  }

  stop() {
    this.isStreaming = false;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.src = '';
      this.audioElement = null;
    }
    if (this.mediaSource) {
      if (this.mediaSource.readyState === 'open') {
        try {
          this.mediaSource.endOfStream();
        } catch (e) {
          // Ignore
        }
      }
      this.mediaSource = null;
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentTime = 0;
    this.duration = 0;
  }

  /**
   * Skip forward/backward by seconds
   */
  skip(seconds) {
    if (this.audioElement) {
      const newTime = this.audioElement.currentTime + seconds;
      this.audioElement.currentTime = Math.max(0, Math.min(newTime, this.audioElement.duration || Infinity));
      this.currentTime = this.audioElement.currentTime;
      this.updateProgressBar();
    }
  }

  /**
   * Seek to specific position (0-1 percentage)
   */
  seek(percentage) {
    if (this.audioElement && this.audioElement.duration) {
      this.audioElement.currentTime = percentage * this.audioElement.duration;
      this.currentTime = this.audioElement.currentTime;
      this.updateProgressBar();
    }
  }

  updateProgressBar() {
    const progressBar = document.querySelector('.voice-progress-fill');
    const timeDisplay = document.querySelector('.voice-time-display');
    
    if (progressBar && this.audioElement) {
      const duration = this.audioElement.duration || 0;
      const current = this.audioElement.currentTime || 0;
      const percentage = duration > 0 ? (current / duration) * 100 : 0;
      progressBar.style.width = `${percentage}%`;
      
      if (timeDisplay) {
        timeDisplay.textContent = `${this.formatTime(current)} / ${this.formatTime(duration)}`;
      }
    }
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  updateUIState(state) {
    const player = document.querySelector('.voice-player');
    if (!player) return;

    const playBtn = player.querySelector('.voice-play-btn');
    const status = player.querySelector('.voice-status');
    const controls = player.querySelector('.voice-controls');
    const summarizeBtn = player.querySelector('.voice-summarize-btn');

    // Animate chat avatar when playing
    const chatAvatar = document.getElementById('gavin-chat-avatar');
    const chatToggle = document.getElementById('gavin-chat-toggle');
    
    if (chatAvatar) {
      chatAvatar.classList.toggle('speaking', state === 'playing' || state === 'playing-summary');
    }
    if (chatToggle) {
      chatToggle.classList.toggle('speaking', state === 'playing' || state === 'playing-summary');
    }

    switch(state) {
      case 'generating':
        if (playBtn) {
          playBtn.innerHTML = '<span class="voice-spinner"></span>';
          playBtn.disabled = true;
        }
        if (status) status.textContent = 'Generating audio...';
        if (controls) controls.style.opacity = '0.5';
        break;
      
      case 'generating-summary':
        if (playBtn) {
          playBtn.innerHTML = '<span class="voice-spinner"></span>';
          playBtn.disabled = true;
        }
        if (status) status.textContent = 'Creating summary...';
        break;
      
      case 'playing':
        if (playBtn) {
          playBtn.innerHTML = this.getPauseIcon();
          playBtn.disabled = false;
        }
        if (status) status.textContent = 'Playing full post';
        if (controls) controls.style.opacity = '1';
        if (summarizeBtn) summarizeBtn.classList.remove('active');
        break;
      
      case 'playing-summary':
        if (playBtn) {
          playBtn.innerHTML = this.getPauseIcon();
          playBtn.disabled = false;
        }
        if (status) status.textContent = 'Playing summary (~60 sec)';
        if (summarizeBtn) summarizeBtn.classList.add('active');
        break;
      
      case 'paused':
        if (playBtn) {
          playBtn.innerHTML = this.getPlayIcon();
          playBtn.disabled = false;
        }
        if (status) status.textContent = 'Paused';
        break;
      
      case 'error':
        if (playBtn) {
          playBtn.innerHTML = this.getPlayIcon();
          playBtn.disabled = false;
        }
        if (status) status.textContent = 'Error. Try again.';
        if (controls) controls.style.opacity = '1';
        break;
      
      default: // idle
        if (playBtn) {
          playBtn.innerHTML = this.getPlayIcon();
          playBtn.disabled = false;
        }
        if (status) status.textContent = 'Listen to this post';
        if (controls) controls.style.opacity = '1';
        if (summarizeBtn) summarizeBtn.classList.remove('active');
    }
  }

  getPlayIcon() {
    return `<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>`;
  }

  getPauseIcon() {
    return `<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="4" width="4" height="16" rx="1"/>
      <rect x="14" y="4" width="4" height="16" rx="1"/>
    </svg>`;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.voicePlayer = new VoicePlayer();
});
