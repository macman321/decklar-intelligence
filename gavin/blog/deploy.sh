#!/bin/bash
# Deploy script for Gavin's Decklar Blog
# Usage: ./deploy.sh [environment]

set -e

ENV=${1:-production}
BLOG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$BLOG_DIR/_site"

echo "🚀 Deploying Gavin's Decklar Blog to $ENV..."

# Ensure build is fresh
echo "📦 Building site..."
cd "$BLOG_DIR"
npm run build

# Update API endpoints in built files for production
if [ "$ENV" = "production" ]; then
    echo "🔧 Updating API endpoints for production..."
    # Replace localhost:4005 with production voice API URL
    find "$SITE_DIR" -name "*.html" -o -name "*.js" | xargs sed -i '' 's|http://localhost:4005|https://voice-api.decklar.io|g' 2>/dev/null || true
fi

# Deploy to GitHub Pages
echo "📤 Deploying to GitHub Pages..."
cd "$SITE_DIR"

# Create a temporary git repo for gh-pages branch
DEPLOY_DIR="/tmp/gavin-blog-deploy"
rm -rf "$DEPLOY_DIR"
cp -r "$SITE_DIR" "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Initialize git and push to gh-pages
git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub Pages
git push -f "https://github.com/macman321/decklar-intelligence.git" gh-pages:gh-pages

echo "✅ Static site deployed to GitHub Pages"
echo "🌐 URL: https://macman321.github.io/decklar-intelligence/gavin/blog/"

# Cleanup
rm -rf "$DEPLOY_DIR"

echo ""
echo "⚠️  IMPORTANT: Voice API still needs separate deployment!"
echo "   Options:"
echo "   1. Deploy voice-server.js to Render.com (FREE)"
echo "   2. Deploy voice-server.js to Railway.app (FREE)"
echo "   3. Use ngrok to expose localhost:4005 temporarily"
echo ""
