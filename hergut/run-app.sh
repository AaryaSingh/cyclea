#!/bin/bash

# HerGut App Runner Script
# This script sets up the proper environment and runs the React Native app

echo "🚀 Starting HerGut App..."

# Set proper locale for CocoaPods
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the hergut project root directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if iOS pods are installed
if [ ! -d "ios/Pods" ]; then
    echo "🍎 Installing iOS pods..."
    cd ios
    pod install
    cd ..
fi

# Start Metro bundler in background
echo "📱 Starting Metro bundler..."
npx react-native start &
METRO_PID=$!

# Wait a moment for Metro to start
sleep 3

# Run the app
echo "📱 Launching app on iOS simulator..."
npx react-native run-ios --simulator="iPhone 15"

# Clean up Metro process when done
echo "🧹 Cleaning up..."
kill $METRO_PID 2>/dev/null

echo "✅ Done!"
