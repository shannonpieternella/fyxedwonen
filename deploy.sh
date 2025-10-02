#!/bin/bash

# Deployment script for fyxedwonen.nl
# This script builds the React app and deploys it to Hetzner server

echo "🚀 Starting deployment to fyxedwonen.nl..."

# SSH connection details
SERVER_USER="root"
SERVER_IP="128.140.109.71"
SSH_KEY="$HOME/.ssh/id_rsa"
REPO_URL="https://github.com/shannonpieternella/fyxedwonen.git"

# Build the React app
echo "📦 Building React app..."
cd client
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Hetzner server
echo "📤 Deploying to Hetzner server..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'EOF'
    cd /var/www/fyxedwonen || exit 1
    git pull origin master
    cd client
    npm install
    npm run build
    echo "✅ Deployment complete!"
EOF

if [ $? -eq 0 ]; then
    echo "🎉 Deployment to fyxedwonen.nl completed successfully!"
else
    echo "❌ Deployment failed!"
    exit 1
fi
