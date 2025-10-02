#!/bin/bash

# Deployment script for fyxedwonen.nl
# This script builds the React app and deploys it to Hetzner server

echo "🚀 Starting deployment to fyxedwonen.nl..."

# SSH connection details
SERVER_USER="root"
SERVER_IP="128.140.109.71"
SSH_KEY="$HOME/.ssh/id_rsa"

# Build the React app locally
echo "📦 Building React app..."
cd client
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Upload build files to server (to Nginx docroot)
echo "📤 Uploading build files to Hetzner server (docroot)..."
cd ..

# Nginx serves from this docroot per config
SERVER_DOCROOT="/var/www/fyxedwonen/"

# Prefer rsync for atomic, deleted-file sync; fallback to scp
if command -v rsync >/dev/null 2>&1; then
    rsync -avz --delete -e "ssh -i $SSH_KEY" client/build/ "$SERVER_USER@$SERVER_IP:$SERVER_DOCROOT"
else
    echo "⚠️ rsync not found locally; falling back to scp (no delete)." >&2
    scp -i "$SSH_KEY" -r client/build/* "$SERVER_USER@$SERVER_IP:$SERVER_DOCROOT"
fi

if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    exit 1
fi

echo "✅ Upload successful!"

# Reload nginx
echo "🔄 Reloading nginx..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" 'systemctl reload nginx'

if [ $? -eq 0 ]; then
    echo "🎉 Deployment to fyxedwonen.nl completed successfully!"
else
    echo "❌ Nginx reload failed!"
    exit 1
fi
