#!/bin/bash

# ===============================
# Simple SCP Deploy Script
# ===============================

# VPS configuration
VPS_USER="deploy"
VPS_HOST="your_vps_ip"
VPS_PATH="/var/www/grameenschool.online"

# Local Vue.js project
LOCAL_PROJECT_PATH="$(pwd)"      # assume you are in project root
BUILD_PATH="$LOCAL_PROJECT_PATH/dist"

# Step 1: Build Vue.js project
echo "Building Vue.js project..."
npm ci
npm run build

# Step 2: Deploy to VPS via SCP
echo "Deploying to VPS..."
scp -r $BUILD_PATH/* $VPS_USER@$VPS_HOST:$VPS_PATH

# Step 3: Optional - restart nginx (uncomment if needed)
# ssh $VPS_USER@$VPS_HOST "sudo systemctl restart nginx"

echo "Deployment complete!"
