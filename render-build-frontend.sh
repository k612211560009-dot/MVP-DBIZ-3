#!/bin/sh
# Render build script for frontend

echo "📦 Installing frontend dependencies..."
cd frontend
npm ci

echo "🏗️  Building frontend..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "✅ Frontend build complete!"
echo "📁 Build output in: frontend/dist"
