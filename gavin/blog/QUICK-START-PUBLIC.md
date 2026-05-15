# Quick Start - Public Access in 5 Minutes

## Option 1: Immediate Access via ngrok (Temporary)

Use ngrok to expose your local server immediately while setting up production hosting.

### Step 1: Install ngrok
```bash
# macOS with Homebrew
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start Tunnel
```bash
# Terminal 1: Ensure voice server is running
cd ~/decklar-intelligence/gavin/blog
node api/voice-server.js

# Terminal 2: Start ngrok tunnel
ngrok http 4005
```

### Step 3: Update Blog Config
Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and update:

```bash
# Edit the config file
vim ~/decklar-intelligence/gavin/blog/js/config.js

# Change production URL:
VOICE_API_URL: 'https://abc123.ngrok.io'
```

### Step 4: Redeploy
```bash
cd ~/decklar-intelligence/gavin/blog
./deploy.sh production
```

**Result**: Blog is live with working voice API!

---

## Option 2: Production Deploy (Recommended)

### Step 1: Deploy Voice API to Render.com

1. Go to https://dashboard.render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect repo: `macman321/decklar-intelligence`
5. Configure:
   - **Name**: `gavin-voice-api`
   - **Root Directory**: `gavin/blog/voice-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node voice-server.js`
6. Add Environment Variable:
   - `ELEVENLABS_API_KEY` = `sk_b9487f82ad1507c97508d9b9d4a3a1fd`
7. Click "Create Web Service"

Wait ~2 minutes for deployment. Copy the URL (e.g., `https://gavin-voice-api-xxx.onrender.com`)

### Step 2: Update Config
```bash
vim ~/decklar-intelligence/gavin/blog/js/config.js

# Update:
VOICE_API_URL: 'https://gavin-voice-api-xxx.onrender.com'
```

### Step 3: Redeploy Blog
```bash
cd ~/decklar-intelligence/gavin/blog
./deploy.sh production
```

---

## Verify Everything Works

1. **Static Site**: https://macman321.github.io/decklar-intelligence/gavin/blog/
2. **Voice API Health**: https://YOUR-API-URL/api/health
3. **Voice Player**: Click "Listen" on any post
4. **Chat Widget**: Ask a question

---

## URLs

| Component | URL |
|-----------|-----|
| Static Site | https://macman321.github.io/decklar-intelligence/gavin/blog/ |
| Voice API (ngrok) | https://YOUR-URL.ngrok.io |
| Voice API (Render) | https://gavin-voice-api-xxx.onrender.com |

---

*Your blog is ready to go live! 🚀*
