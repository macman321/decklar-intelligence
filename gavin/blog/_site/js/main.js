/**
 * Native Speech Synthesis - "Listen with Siri" Button
 * Uses iOS/macOS native TTS (no server required)
 */
class NativeVoicePlayer {
  constructor() {
    this.synth = window.speechSynthesis;
    this.utterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.voices = [];
    this.preferredVoice = null;
    
    // Load voices (async on some browsers)
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
    
    // Prefer Siri voice on iOS, then system defaults
    this.preferredVoice = this.voices.find(v => 
      v.name.includes('Samantha') || // iOS Siri (US)
      v.name.includes('Karen') ||    // iOS Siri (AU)
      v.name.includes('Daniel') ||  // iOS Siri (UK)
      v.name.includes('Moira') ||    // iOS Siri (IE)
      v.name.includes('Tessa')      // iOS Siri (ZA)
    ) || this.voices.find(v => 
      v.name.includes('Alex') ||     // macOS default
      v.name.includes('Fred')
    ) || this.voices[0];
    
    console.log('[NativeVoice] Voices loaded:', this.voices.length, 'Selected:', this.preferredVoice?.name);
  }

  speak(text) {
    if (!this.synth) {
      alert('Speech synthesis not supported on this device');
      return;
    }

    // Toggle pause/resume if already playing this text
    if (this.isPlaying && !this.isPaused) {
      this.pause();
      return;
    }
    
    if (this.isPaused) {
      this.resume();
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Create utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    
    if (this.preferredVoice) {
      this.utterance.voice = this.preferredVoice;
    }
    
    // Optimize for blog reading
    this.utterance.rate = 0.95;      // Slightly slower for comprehension
    this.utterance.pitch = 1.0;      // Natural pitch
    this.utterance.volume = 1.0;     // Full volume
    
    // Event handlers
    this.utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.updateUI('playing');
      console.log('[NativeVoice] Started speaking');
    };
    
    this.utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.updateUI('idle');
      console.log('[NativeVoice] Finished speaking');
    };
    
    this.utterance.onpause = () => {
      this.isPaused = true;
      this.updateUI('paused');
    };
    
    this.utterance.onresume = () => {
      this.isPaused = false;
      this.updateUI('playing');
    };
    
    this.utterance.onerror = (e) => {
      console.error('[NativeVoice] Error:', e);
      this.isPlaying = false;
      this.isPaused = false;
      this.updateUI('error');
    };

    // Start speaking
    this.synth.speak(this.utterance);
  }

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPaused = true;
      this.updateUI('paused');
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.updateUI('playing');
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.updateUI('idle');
    }
  }

  updateUI(state) {
    const buttons = document.querySelectorAll('.native-voice-btn');
    buttons.forEach(btn => {
      const icon = btn.querySelector('.voice-icon');
      const label = btn.querySelector('.voice-label');
      
      switch(state) {
        case 'playing':
          btn.classList.add('playing');
          btn.classList.remove('paused');
          if (icon) icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
          if (label) label.textContent = 'Pause';
          break;
        case 'paused':
          btn.classList.remove('playing');
          btn.classList.add('paused');
          if (icon) icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
          if (label) label.textContent = 'Resume';
          break;
        default: // idle
          btn.classList.remove('playing', 'paused');
          if (icon) icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
          if (label) label.textContent = 'Listen';
      }
    });
  }
}

// Initialize native voice player
document.addEventListener('DOMContentLoaded', () => {
  window.nativeVoice = new NativeVoicePlayer();
  
  // Wire up native voice buttons
  document.querySelectorAll('.native-voice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.text || document.querySelector('.post-content')?.innerText;
      if (text) {
        window.nativeVoice.speak(text);
      }
    });
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(2, 6, 23, 0.95)';
    } else {
        header.style.background = 'rgba(2, 6, 23, 0.8)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to cards and sections
document.querySelectorAll('.post-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});