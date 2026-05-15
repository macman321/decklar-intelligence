# Production Deployment Guide - Gavin's Decklar Blog

## Overview

The blog consists of two components:
1. **Static Site** (Eleventy) → GitHub Pages
2. **Voice API** (Node.js) → Render.com or Railway

---

## Step 1: Deploy Static Site to GitHub Pages

```bash
cd ~/decklar-intelligence/gavin/blog

# Run the deploy script
./deploy.sh production
```

Or manually:

```bash
# Build the site
npm run build

# Deploy _site/ contents to gh-pages branch
cd _site
git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy $(date)"
git push -f https://github.com/macman321/decklar-intelligence.git gh-pages:gh-pages
```

**Result**: Site at `https://macman321.github.io/decklar-intelligence/gavin/blog/`

---

## Step 2: Deploy Voice API to Render.com (FREE)

### 2.1 Sign up / Log in
- Go to https://render.com
- Connect your GitHub account

### 2.2 Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repo: `macman321/decklar-intelligence`
3. Configure:
   - **Name**: `gavin-voice-api`
   - **Runtime**: Node
   - **Build Command**: `cd gavin/blog/voice-api && echo "Ready"`
   - **Start Command**: `cd gavin/blog/voice-api && node voice-server.js`
   - **Plan**: Free

### 2.3 Set Environment Variables
In Render Dashboard → Environment:
```
ELEVENLABS_API_KEY=sk_b9487f82ad1507c97508d9b9d4a3a1fd
PORT=4005
VOICE_API_PORT=4005
NODE_ENV=production
```

### 2.4 Health Check
Render will auto-detect `/api/health` endpoint.

**Result**: API at `https://gavin-voice-api.onrender.com`

---

## Step 3: Update Frontend API URLs

Once the Voice API is deployed, update the static site config:

```bash
# Edit config.js
vim ~/decklar-intelligence/gavin/blog/js/config.js

# Update production URL:
VOICE_API_URL: 'https://gavin-voice-api.onrender.com'
```

Rebuild and redeploy:
```bash
cd ~/decklar-intelligence/gavin/blog
npm run build
./deploy.sh production
```

---

## Step 4: Test Everything

1. **Static Site**: Visit `https://macman321.github.io/decklar-intelligence/gavin/blog/`
2. **Voice API**: Test `https://gavin-voice-api.onrender.com/api/health`
3. **Full Flow**: Try the voice player on any post

---

## Alternative: Railway.app

Similar process to Render:
1. Sign up at https://railway.app
2. Connect GitHub repo
3. Use `voice-api/railway.json` for config
4. Set `ELEVENLABS_API_KEY` in environment variables

---

## Custom Domain (Optional)

### For Static Site (GitHub Pages):
1. Add `CNAME` file to `static/` folder with domain name
2. Configure DNS A/ALIAS records pointing to GitHub Pages IPs

### For Voice API (Render):
1. In Render Dashboard → Settings → Custom Domain
2. Add custom domain and configure DNS

---

## Monitoring

### Render Dashboard
- Uptime monitoring built-in
- Logs available in Dashboard → Logs
- Auto-restart on failure (Free tier: 15 min sleep after inactivity)

### GitHub Pages
- Automatic HTTPS
- CDN included
- No monitoring needed (static files)

---

## Security Checklist

- [ ] `ELEVENLABS_API_KEY` stored only in server environment
- [ ] No API keys in frontend code ✓ (verified)
- [ ] CORS configured on server ✓ (already set)
- [ ] Chat widget blocks sensitive keywords ✓ (already implemented)
- [ ] HTTPS enforced on both services

---

## Troubleshooting

### Voice API not responding
1. Check Render Logs
2. Verify `ELEVENLABS_API_KEY` is set
3. Test health endpoint: `curl https://gavin-voice-api.onrender.com/api/health`

### Static site not updating
1. Clear browser cache (hard refresh: Cmd+Shift+R)
2. Verify GitHub Pages deployment in repo Settings → Pages
3. Check Actions tab for build errors

### CORS errors
1. Verify API domain matches `config.js` VOICE_API_URL
2. Check server CORS headers in `voice-server.js`

---

## Cost

- **GitHub Pages**: FREE (unlimited public repos)
- **Render Web Service**: FREE (sleeps after 15 min inactivity, auto-wakes)
- **ElevenLabs API**: ~$5/mo for typical blog usage
- **Total**: ~$5/month

---

## Deployed URLs

| Component | URL |
|-----------|-----|
| Static Site | https://macman321.github.io/decklar-intelligence/gavin/blog/ |
| Voice API | https://gavin-voice-api.onrender.com |
| Health Check | https://gavin-voice-api.onrender.com/api/health |

---

*Generated: $(date)*
