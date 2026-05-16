// API Configuration
// Auto-detects environment and sets appropriate API endpoint

(function() {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    const isTailscale = window.location.hostname.includes('tailf23089.ts.net');
    
    window.BLOG_CONFIG = {
        // Voice API endpoint
        VOICE_API_URL: isLocalhost 
            ? 'http://localhost:4005' 
            : (isTailscale
                ? 'http://jarvisai.tailf23089.ts.net:4005'
                : (isGitHubPages 
                    ? 'https://gavin-voice-api.onrender.com'
                    : 'https://voice-api.decklar.io')),
        
        // Environment
        ENV: isLocalhost ? 'development' : 'production',
        
        // Cache settings
        AUDIO_CACHE_ENABLED: true,
        
        // Debug mode
        DEBUG: isLocalhost
    };
    
    // Log configuration in dev
    if (window.BLOG_CONFIG.DEBUG) {
        console.log('[Blog Config]', window.BLOG_CONFIG);
    }
})();
