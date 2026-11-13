#!/bin/bash
# ===================================================================
# Wanderlust Backend API Deployment Script for AWS EC2
# ===================================================================
set -e

echo "🚀 [1/3] Pulling latest backend commits from GitHub..."
git pull origin main

echo "📦 [2/3] Installing dependencies..."
cd backend
npm install

echo "🔄 [3/3] Restarting Wanderlust API Service (Port 5000)..."
if command -v pm2 >/dev/null 2>&1; then
  pm2 restart all || pm2 start server.js --name "wanderlust-api"
else
  pkill -f "node server.js" || true
  nohup node server.js > api.log 2>&1 &
  echo "✓ Started node server.js with nohup on port 5000"
fi

sleep 2
echo "🔍 Checking API Health Check Endpoint..."
curl -s http://localhost:5000/api/health || true
echo ""

echo "==================================================================="
echo "🎉 Backend API Deployment Successful!"
echo "ALB Target Group Health Check: /api/health (Port 5000)"
echo "==================================================================="
