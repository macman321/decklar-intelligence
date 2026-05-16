/**
 * Native Voice Player v4.0.1
 * Web Speech API (Siri-style) TTS for blog posts
 * Falls back to browser default voices
 */

class NativeVoicePlayer {
  constructor() {
    this.synth = window.speechSynthesis;
    this.utterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.onComplete = null;
    this.init();
  }

  init() {
    // Wait for voices to load
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.selectBestVoice();
    }
    this.selectBestVoice();
    console.log('[NativeVoicePlayer] Initialized v4.0.1');
  }

  selectBestVoice() {
    const voices = this.synth.getVoices();
    if (!voices.length) return;

    // Detect Apple devices (iOS/macOS) - use system default Siri voice
    const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform) || 
                    /Apple/.test(navigator.vendor);
    
    if (isApple) {
      // On Apple devices, use null to respect user's Siri voice selection
      this.preferredVoice = null;
      console.log('[NativeVoicePlayer] Apple device detected - using system Siri voice');
      return;
    }

    // Non-Apple devices: prefer high-quality voices
    const preferred = [
      'Google US English', 'Google UK English Female',
      'Microsoft Zira', 'Microsoft David',
      'en-US', 'en-GB'
    ];

    for (const name of preferred) {
      const voice = voices.find(v => v.name.includes(name) || v.lang.startsWith(name));
      if (voice) {
        this.preferredVoice = voice;
        console.log(`[NativeVoicePlayer] Selected voice: ${voice.name}`);
        return;
      }
    }

    // Fallback to first English voice
    this.preferredVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  speak(text) {
    if (!text) return;

    // Cancel any ongoing speech
    this.stop();

    // Truncate to reasonable length (500 chars for preview)
    const previewText = text.slice(0, 500).trim();

    this.utterance = new SpeechSynthesisUtterance(previewText);
    this.utterance.voice = this.preferredVoice;
    this.utterance.rate = 1.0;
    this.utterance.pitch = 1.0;
    this.utterance.volume = 1.0;

    this.utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      console.log('[NativeVoicePlayer] Started speaking');
    };

    this.utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      if (this.onComplete) this.onComplete();
      console.log('[NativeVoicePlayer] Finished speaking');
    };

    this.utterance.onerror = (e) => {
      console.error('[NativeVoicePlayer] Error:', e);
      this.isPlaying = false;
    };

    this.synth.speak(this.utterance);
  }

  pause() {
    if (this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  stop() {
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if ('speechSynthesis' in window) {
    window.nativeVoice = new NativeVoicePlayer();
    console.log('[NativeVoice] Web Speech API ready');
  } else {
    console.warn('[NativeVoice] Web Speech API not supported');
    // Hide native voice buttons
    document.querySelectorAll('.native-voice-section').forEach(el => el.style.display = 'none');
  }
});
