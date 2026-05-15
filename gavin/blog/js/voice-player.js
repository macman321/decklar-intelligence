/**
 * Blog 3.0.0 Voice Player
 * ElevenLabs integration for reading posts aloud
 * Voice ID: Qmc2m2l7n30eeewMpBpY
 */

class VoicePlayer {
  constructor() {
    this.voiceId = 'Qmc2m2l7n30eeewMpBpY';
    this.apiKey = null; // Set from environment or config
    this.audioCache = new Map();
    this.currentAudio = null;
    this.isPlaying = false;
    this.isGenerating = false;
  }

  async init(apiKey) {
    this.apiKey = apiKey;
    console.log('[VoicePlayer] Initialized');
  }

  /**
   * Generate audio for text using ElevenLabs
   */
  async generateAudio(text, postId) {
    if (this.audioCache.has(postId)) {
      return this.audioCache.get(postId);
    }

    if (this.isGenerating) {
      console.log('[VoicePlayer] Already generating, please wait...');
      return null;
    }

    this.isGenerating = true;
    this.updateUIState('generating');

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      this.audioCache.set(postId, audioUrl);
      
      this.isGenerating = false;
      return audioUrl;
    } catch (error) {
      console.error('[VoicePlayer] Generation failed:', error);
      this.isGenerating = false;
      this.updateUIState('error');
      return null;
    }
  }

  /**
   * Play audio for a post
   */
  async play(postId, text) {
    if (this.currentAudio) {
      this.pause();
      return;
    }

    let audioUrl = this.audioCache.get(postId);
    
    if (!audioUrl) {
      audioUrl = await this.generateAudio(text, postId);
      if (!audioUrl) return;
    }

    this.currentAudio = new Audio(audioUrl);
    this.currentAudio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentAudio = null;
      this.updateUIState('idle');
    });

    this.currentAudio.play();
    this.isPlaying = true;
    this.updateUIState('playing');
  }

  pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.updateUIState('idle');
  }

  updateUIState(state) {
    const player = document.querySelector('.voice-player');
    if (!player) return;

    const btn = player.querySelector('.voice-play-btn');
    const status = player.querySelector('.voice-status');

    switch(state) {
      case 'generating':
        btn.innerHTML = '<span class="voice-spinner"></span>';
        btn.disabled = true;
        status.textContent = 'Generating audio...';
        break;
      case 'playing':
        btn.innerHTML = `
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        `;
        btn.disabled = false;
        status.textContent = 'Playing...';
        break;
      case 'error':
        btn.innerHTML = `
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        `;
        status.textContent = 'Error. Try again.';
        break;
      default:
        btn.innerHTML = `
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        `;
        status.textContent = 'Listen to this post';
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.voicePlayer = new VoicePlayer();
});
