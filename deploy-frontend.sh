#!/bin/bash
# ===================================================================
# Wanderlust Frontend Deployment Script for AWS EC2
# ===================================================================
set -e

echo "🚀 [1/4] Pulling latest commits from GitHub (origin/main)..."
git pull origin main

echo "📦 [2/4] Building optimized production React bundle..."
cd frontend
npm install
npm run build

echo "🌐 [3/4] Deploying to Nginx web root..."
if [ -d "/var/www/html" ]; then
  sudo cp -r dist/* /var/www/html/
  echo "✓ Copied build assets to /var/www/html/"
fi

echo "🔄 [4/4] Reloading Nginx service..."
sudo systemctl reload nginx || sudo systemctl restart nginx

echo "==================================================================="
echo "🎉 Frontend Deployment Successful!"
echo "Check your live site on your ALB:"
echo "👉 http://TRAVEL-ALB-198965046.ap-southeast-2.elb.amazonaws.com"
echo "==================================================================="
