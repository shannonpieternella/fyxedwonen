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

## Upload build files to server (to Nginx docroot)
echo "📤 Uploading build files to Hetzner server (docroot)..."
cd ..

# Nginx serves from this docroot per config
SERVER_ROOT="/var/www/fyxedwonen"

# Prefer rsync for accurate sync; exclude backend and dotfiles
if command -v rsync >/dev/null 2>&1; then
    rsync -avz --delete \
      --exclude 'server/' \
      --exclude '.git/' \
      --exclude '.git*' \
      -e "ssh -i $SSH_KEY" \
      client/build/ "$SERVER_USER@$SERVER_IP:$SERVER_ROOT/"
else
    echo "⚠️ rsync not found locally; falling back to scp (no delete)." >&2
    scp -i "$SSH_KEY" -r client/build/* "$SERVER_USER@$SERVER_IP:$SERVER_ROOT/"
fi

## Deploy backend server code (if .env exists)
echo "🛠️ Updating backend server code..."
if ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "test -f $SERVER_ROOT/server/.env"; then
  echo "✅ .env found on server; proceeding with backend deploy"
  if command -v rsync >/dev/null 2>&1; then
      rsync -avz --delete \
        --exclude 'node_modules/' \
        -e "ssh -i $SSH_KEY" \
        server/ "$SERVER_USER@$SERVER_IP:$SERVER_ROOT/server/"
  else
      echo "⚠️ rsync not found; uploading server via scp (no delete)." >&2
      scp -i "$SSH_KEY" -r server/* "$SERVER_USER@$SERVER_IP:$SERVER_ROOT/server/"
  fi

  # Install dependencies and restart Node server
  echo "🔁 Installing server deps and restarting API..."
  ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" bash -lc "\
    if command -v npm >/dev/null 2>&1; then \
      npm --prefix /var/www/fyxedwonen/server install --production || exit 1; \
    fi; \
    # Restart running node on port 5001 if present
    pkill -f '/var/www/fyxedwonen/server/index.js' >/dev/null 2>&1 || true; \
    nohup node /var/www/fyxedwonen/server/index.js > /var/log/fyxedwonen-server.log 2>&1 & \
    sleep 1; \
    ss -ltnp | awk '/:5001/ {print \$0}' >/dev/null 2>&1 || true; \
    exit 0 \
  "
  if [ $? -ne 0 ]; then
      echo "❌ Backend restart failed!"
      exit 1
  fi
  echo "✅ Backend updated"
else
  echo "⚠️ No .env on server; skipping backend deploy and restart to avoid downtime."
fi

echo "✅ Frontend upload successful!"

# Reload nginx
echo "🔄 Reloading nginx..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" 'systemctl reload nginx'

if [ $? -eq 0 ]; then
    echo "🎉 Deployment to fyxedwonen.nl completed successfully!"
else
    echo "❌ Nginx reload failed!"
    exit 1
fi
