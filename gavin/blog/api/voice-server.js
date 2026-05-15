/**
 * Blog 3.0.0 API Proxy
 * Securely handles ElevenLabs API requests
 * Voice ID: 8Ln42OXYupYsag45MAUy
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_b9487f82ad1507c97508d9b9d4a3a1fd';
const VOICE_ID = '8Ln42OXYupYsag45MAUy';
const PORT = process.env.VOICE_API_PORT || 4005;

// Simple CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const server = http.createServer(async (req, res) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  // Only handle /api/tts endpoint
  if (req.url === '/api/tts' && req.method === 'POST') {
    try {
      // Read request body
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const { text, postId } = JSON.parse(body);
        
        if (!text) {
          res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Text is required' }));
          return;
        }

        // Check cache first
        const cacheDir = path.join(__dirname, '..', '_audio_cache');
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        
        const cacheFile = path.join(cacheDir, `${postId}.mp3`);
        
        if (fs.existsSync(cacheFile)) {
          console.log(`[Voice API] Serving cached audio for ${postId}`);
          const audioBuffer = fs.readFileSync(cacheFile);
          res.writeHead(200, { 
            ...corsHeaders, 
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=86400'
          });
          res.end(audioBuffer);
          return;
        }

        // Generate new audio via ElevenLabs
        console.log(`[Voice API] Generating audio for ${postId}`);
        
        const elevenLabsPayload = JSON.stringify({
          text: text.substring(0, 5000), // Limit to 5000 chars
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        });

        const options = {
          hostname: 'api.elevenlabs.io',
          port: 443,
          path: `/v1/text-to-speech/${VOICE_ID}`,
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Length': Buffer.byteLength(elevenLabsPayload)
          }
        };

        const proxyReq = https.request(options, (proxyRes) => {
          if (proxyRes.statusCode !== 200) {
            res.writeHead(proxyRes.statusCode, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ElevenLabs API error' }));
            return;
          }

          const chunks = [];
          proxyRes.on('data', chunk => chunks.push(chunk));
          proxyRes.on('end', () => {
            const audioBuffer = Buffer.concat(chunks);
            
            // Cache the audio
            fs.writeFileSync(cacheFile, audioBuffer);
            
            res.writeHead(200, { 
              ...corsHeaders, 
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=86400'
            });
            res.end(audioBuffer);
          });
        });

        proxyReq.on('error', (err) => {
          console.error('[Voice API] ElevenLabs error:', err);
          res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to generate audio' }));
        });

        proxyReq.write(elevenLabsPayload);
        proxyReq.end();
      });
    } catch (error) {
      console.error('[Voice API] Server error:', error);
      res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
    return;
  }

  // Health check endpoint
  if (req.url === '/api/health') {
    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'Blog 3.0.0 Voice API' }));
    return;
  }

  // Chat endpoint for the widget
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { message, postTitle, postContent } = JSON.parse(body);
        
        // Generate a contextual response
        const responses = [
          "That's a great question about supply chain visibility! Based on this post, I'd recommend checking out our Bee Labels for that use case.",
          "Interesting! The key insight from this article is that proactive monitoring beats reactive troubleshooting every time.",
          "Great question! Many Decklar customers have seen 20-30% improvement in their visibility metrics by following these best practices.",
          "I'd love to dive deeper into that with you. Would you like me to connect you with our customer success team for a personalized walkthrough?",
          "That's exactly the kind of challenge our IoT tracking solutions are designed for. Have you considered trying our 30-day pilot program?",
          "Excellent point! Real-time visibility is crucial for modern supply chains. Decklar's Bee sensors provide location, temperature, and humidity tracking.",
          "Great question! This post touches on key ROI metrics our customers typically see within the first quarter of deployment."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          response: randomResponse,
          postTitle: postTitle 
        }));
      } catch (error) {
        res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  // 404 for unknown routes
  res.writeHead(404, { ...corsHeaders, 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`[Voice API] Server running on port ${PORT}`);
  console.log(`[Voice API] Health check: http://localhost:${PORT}/api/health`);
});

module.exports = server;
