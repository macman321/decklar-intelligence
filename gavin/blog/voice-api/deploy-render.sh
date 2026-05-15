#!/bin/bash
# One-click deploy to Render.com
# Prerequisites: Install Render CLI - https://render.com/docs/cli

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Deploying Gavin Voice API to Render.com..."

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "⚠️  Render CLI not found. Installing..."
    
    # Install Render CLI
    curl -fsSL https://render.com/download-cli-for-linux.sh | bash
    export PATH="$HOME/.render/bin:$PATH"
fi

# Check login status
if ! render whoami &> /dev/null; then
    echo "🔑 Please login to Render:"
    render login
fi

# Deploy using render.yaml
cd "$DIR"

echo "📦 Deploying web service..."
render blueprint apply

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Find 'gavin-voice-api' service"
echo "3. Add ELEVENLABS_API_KEY to Environment Variables"
echo "4. Copy the deployed URL (e.g., https://gavin-voice-api-xxx.onrender.com)"
echo "5. Update js/config.js with the production API URL"
echo ""
