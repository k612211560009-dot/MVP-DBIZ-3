#!/bin/sh
# Render build script for backend

echo "📦 Installing backend dependencies..."
cd backend
npm ci --omit=dev

echo "✅ Backend build complete!"
