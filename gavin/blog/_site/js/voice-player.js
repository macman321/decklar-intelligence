/**
 * Blog 4.1.0 Voice Player
 * ElevenLabs real-time streaming with enhanced controls
 * Features: Stream playback, Seek, ±10s skip, Time sync, Word highlighting
 * Voice ID: 8Ln42OXYupYsag45MAUy
 */

class VoicePlayer {
  constructor() {
    this.voiceId = '8Ln42OXYupYsag45MAUy';
    this.apiKey = null;
    this.audio = null;
    this.isPlaying = false;
    this.isGenerating = false;
    this.postId = null;
    this.fullText = '';
    this.sentences = [];
    this.currentSentenceIndex = 0;
    
    // UI elements
    this.playBtn = null;
    this.progressBar = null;
    this.progressContainer = null;
    this.timeDisplay = null;
    this.skipBackBtn = null;
    this.skipForwardBtn = null;
    this.statusText = null;
    this.playerContainer = null;
    
    // API endpoints
    const baseUrl = window.BLOG_CONFIG?.VOICE_API_URL || `http://${window.location.hostname}:4005`;
    this.streamUrl = `${baseUrl}/api/tts/stream`;
    this.summarizeUrl = `${baseUrl}/api/summarize`;
    
    this.init();
  }

  init() {
    this.createPlayerUI();
    this.attachEventListeners();
    console.log('[VoicePlayer] v4.1.0 initialized');
  }

  createPlayerUI() {
    // Find or create player container
    let container = document.querySelector('.voice-player-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'voice-player-container';
      container.innerHTML = `
        <div class="voice-player">
          <div class="voice-player-header">
            <button class="voice-play-btn" aria-label="Play">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <div class="voice-time-display">0:00 / 0:00</div>
          </div>
          
          <div class="voice-progress-container">
            <div class="voice-progress-bar">
              <div class="voice-progress-fill"></div>
            </div>
          </div>
          
          <div class="voice-controls">
            <button class="voice-skip-btn voice-skip-back" aria-label="Rewind 10 seconds">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7-7 7 7" transform="rotate(90 12 12)"/>
                <text x="12" y="17" text-anchor="middle" font-size="8" fill="currentColor">10</text>
              </svg>
            </button>
            
            <span class="voice-status">Listen to this post</span>
            
            <button class="voice-skip-btn voice-skip-forward" aria-label="Forward 10 seconds">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7 7 7-7" transform="rotate(-90 12 12)"/>
                <text x="12" y="17" text-anchor="middle" font-size="8" fill="currentColor">10</text>
              </svg>
            </button>
          </div>
          
          <button class="voice-summarize-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 12h8M12 8v8"/>
            </svg>
            Summarize (~60 sec)
          </button>
        </div>
      `;
      
      // Insert after native voice section or at top of article
      const nativeSection = document.querySelector('.native-voice-section');
      const article = document.querySelector('.post-content');
      
      if (nativeSection) {
        nativeSection.replaceWith(container);
      } else if (article) {
        article.parentNode.insertBefore(container, article);
      } else {
        document.body.appendChild(container);
      }
    }
    
    // Cache UI elements
    this.playerContainer = container;
    this.playBtn = container.querySelector('.voice-play-btn');
    this.progressBar = container.querySelector('.voice-progress-bar');
    this.progressFill = container.querySelector('.voice-progress-fill');
    this.progressContainer = container.querySelector('.voice-progress-container');
    this.timeDisplay = container.querySelector('.voice-time-display');
    this.skipBackBtn = container.querySelector('.voice-skip-back');
    this.skipForwardBtn = container.querySelector('.voice-skip-forward');
    this.statusText = container.querySelector('.voice-status');
    this.summarizeBtn = container.querySelector('.voice-summarize-btn');
  }

  attachEventListeners() {
    // Play/Pause
    this.playBtn?.addEventListener('click', () => this.togglePlay());
    
    // Skip buttons
    this.skipBackBtn?.addEventListener('click', () => this.skip(-10));
    this.skipForwardBtn?.addEventListener('click', () => this.skip(10));
    
    // Seek bar
    this.progressBar?.addEventListener('click', (e) => this.seek(e));
    
    // Summarize
    this.summarizeBtn?.addEventListener('click', () => this.playSummary());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.togglePlay();
      }
      if (e.code === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        this.skip(-10);
      }
      if (e.code === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        this.skip(10);
      }
    });

    // Get post content from wrapper
    const wrapper = document.querySelector('.voice-player-wrapper');
    if (wrapper && wrapper.dataset.postContent) {
      this.fullText = wrapper.dataset.postContent;
      this.postId = wrapper.dataset.postId;
    }
  }

  async play(postId, text) {
    // If already playing this post, toggle pause
    if (this.postId === postId && this.audio) {
      this.togglePlay();
      return;
    }
    
    // New post - clean up and start fresh
    this.cleanup();
    this.postId = postId;
    this.fullText = text;
    this.sentences = this.splitIntoSentences(text);
    this.currentSentenceIndex = 0;
    
    this.setState('loading');
    
    try {
      // Create audio element with streaming
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      
      // Set up event listeners
      this.setupAudioEvents();
      
      // Start streaming from ElevenLabs
      await this.startStream(text, postId);
      
    } catch (error) {
      console.error('[VoicePlayer] Play failed:', error);
      this.setState('error');
    }
  }

  setupAudioEvents() {
    if (!this.audio) return;
    
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.setState('playing');
      this.startProgressTracking();
    });
    
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.setState('paused');
      this.stopProgressTracking();
    });
    
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.setState('ended');
      this.stopProgressTracking();
      this.currentSentenceIndex = 0;
    });
    
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
      this.highlightCurrentSentence();
    });
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateTimeDisplay();
    });
    
    this.audio.addEventListener('canplay', () => {
      this.setState('playing');
      this.audio.play().catch(err => {
        console.error('[VoicePlayer] Auto-play failed:', err);
        this.setState('ready');
      });
    });
    
    this.audio.addEventListener('error', (e) => {
      console.error('[VoicePlayer] Audio error:', e);
      this.setState('error');
    });
  }

  async startStream(text, postId) {
    // Use MediaSource for true streaming
    if (window.MediaSource && MediaSource.isTypeSupported('audio/mpeg')) {
      await this.streamWithMediaSource(text, postId);
    } else {
      // Fallback: fetch then play
      await this.streamWithFetch(text, postId);
    }
  }

  async streamWithMediaSource(text, postId) {
    const mediaSource = new MediaSource();
    this.mediaSource = mediaSource;
    this.audio.src = URL.createObjectURL(mediaSource);
    
    return new Promise((resolve, reject) => {
      let sourceBuffer = null;
      let bufferQueue = [];
      let streamEnded = false;
      
      mediaSource.addEventListener('sourceopen', async () => {
        try {
          sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
          
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
          
          // Start fetch
          const response = await fetch(this.streamUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text.substring(0, 5000), postId })
          });
          
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const reader = response.body.getReader();
          
          // Start reading chunks
          while (true) {
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
            
            // Queue or append immediately
            if (sourceBuffer.updating) {
              bufferQueue.push(value);
            } else {
              try {
                sourceBuffer.appendBuffer(value);
              } catch (e) {
                bufferQueue.push(value);
              }
            }
            
            // Start playing once we have some buffer (2 chunks ~2KB)
            if (this.audio.paused && bufferQueue.length > 2) {
              this.audio.play().catch(() => {});
            }
          }
          
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      
      mediaSource.addEventListener('error', reject);
    });
  }

  async streamWithFetch(text, postId) {
    const response = await fetch(this.streamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.substring(0, 5000), postId })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    this.audio.src = url;
    
    this.audio.play().catch(err => {
      console.error('[VoicePlayer] Play failed:', err);
    });
  }

  async playSummary() {
    if (this.isGenerating) return;
    
    this.cleanup();
    this.setState('loading');
    
    try {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.setupAudioEvents();
      
      const response = await fetch(this.summarizeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: this.fullText || document.querySelector('.post-content')?.textContent,
          postId: this.postId || 'summary'
        })
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      this.audio.src = url;
      
      this.setState('summary');
      
    } catch (error) {
      console.error('[VoicePlayer] Summary failed:', error);
      this.setState('error');
    }
  }

  togglePlay() {
    if (!this.audio) return;
    
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(err => {
        console.error('[VoicePlayer] Play failed:', err);
      });
    }
  }

  skip(seconds) {
    if (!this.audio) return;
    const newTime = Math.max(0, this.audio.currentTime + seconds);
    this.audio.currentTime = Math.min(newTime, this.audio.duration || Infinity);
    this.updateProgress();
  }

  seek(event) {
    if (!this.audio || !this.audio.duration) return;
    
    const rect = this.progressBar.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    const newTime = percentage * this.audio.duration;
    
    this.audio.currentTime = newTime;
    this.updateProgress();
  }

  updateProgress() {
    if (!this.audio || !this.progressFill) return;
    
    const duration = this.audio.duration || 0;
    const current = this.audio.currentTime || 0;
    const percentage = duration > 0 ? (current / duration) * 100 : 0;
    
    this.progressFill.style.width = `${percentage}%`;
    this.updateTimeDisplay();
  }

  updateTimeDisplay() {
    if (!this.timeDisplay || !this.audio) return;
    
    const current = this.formatTime(this.audio.currentTime);
    const duration = this.formatTime(this.audio.duration);
    this.timeDisplay.textContent = `${current} / ${duration}`;
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds) || seconds === Infinity) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  startProgressTracking() {
    this.stopProgressTracking();
    this.progressInterval = setInterval(() => this.updateProgress(), 100);
  }

  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  splitIntoSentences(text) {
    // Split by sentence endings, keeping delimiters
    return text
      .replace(/([.!?]+)\s+/g, "$1\n")
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 10);
  }

  highlightCurrentSentence() {
    if (!this.audio || this.sentences.length === 0) return;
    
    const duration = this.audio.duration || 1;
    const current = this.audio.currentTime;
    const progress = current / duration;
    
    const sentenceIndex = Math.floor(progress * this.sentences.length);
    
    if (sentenceIndex !== this.currentSentenceIndex && sentenceIndex < this.sentences.length) {
      this.currentSentenceIndex = sentenceIndex;
      
      // Find and highlight the current sentence in the article
      const article = document.querySelector('.post-content');
      if (article) {
        this.highlightSentenceInElement(article, this.sentences[sentenceIndex]);
      }
    }
  }

  highlightSentenceInElement(element, sentence) {
    // Remove existing highlights
    element.querySelectorAll('.voice-highlight').forEach(el => {
      el.classList.remove('voice-highlight');
    });
    
    // Simple approach: find text containing sentence and wrap it
    const textContent = element.textContent;
    const sentenceStart = textContent.indexOf(sentence);
    
    if (sentenceStart > -1) {
      // Scroll to sentence if needed
      const paragraphs = element.querySelectorAll('p');
      for (const p of paragraphs) {
        if (p.textContent.includes(sentence.substring(0, 50))) {
          p.scrollIntoView({ behavior: 'smooth', block: 'center' });
          p.classList.add('voice-highlight');
          break;
        }
      }
    }
  }

  setState(state) {
    if (!this.playerContainer) return;
    
    const states = {
      'idle': { text: 'Listen to this post', icon: 'play', loading: false },
      'loading': { text: 'Starting stream...', icon: 'loading', loading: true },
      'ready': { text: 'Ready to play', icon: 'play', loading: false },
      'playing': { text: 'Playing', icon: 'pause', loading: false },
      'paused': { text: 'Paused', icon: 'play', loading: false },
      'ended': { text: 'Finished', icon: 'replay', loading: false },
      'summary': { text: 'Playing summary', icon: 'pause', loading: false },
      'error': { text: 'Error - try again', icon: 'play', loading: false }
    };
    
    const config = states[state] || states['idle'];
    
    // Update status text
    if (this.statusText) {
      this.statusText.textContent = config.text;
    }
    
    // Update play button
    if (this.playBtn) {
      if (config.loading) {
        this.playBtn.innerHTML = '<span class="voice-spinner"></span>';
        this.playBtn.disabled = true;
      } else {
        this.playBtn.disabled = false;
        const icons = {
          'play': '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
          'pause': '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
          'replay': '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>'
        };
        this.playBtn.innerHTML = icons[config.icon] || icons['play'];
      }
    }
    
    // Update summarize button
    if (this.summarizeBtn) {
      this.summarizeBtn.classList.toggle('active', state === 'summary');
    }
    
    // Toggle playing class on container
    this.playerContainer.classList.toggle('is-playing', state === 'playing' || state === 'summary');
  }

  cleanup() {
    this.stopProgressTracking();
    
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    
    if (this.mediaSource) {
      if (this.mediaSource.readyState === 'open') {
        try {
          this.mediaSource.endOfStream();
        } catch (e) {}
      }
      this.mediaSource = null;
    }
    
    this.isPlaying = false;
    this.isGenerating = false;
    
    // Clear highlights
    document.querySelectorAll('.voice-highlight').forEach(el => {
      el.classList.remove('voice-highlight');
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.voicePlayer = new VoicePlayer();
});
