#!/bin/bash

echo "📚 Family Library App - Startup Script"
echo "======================================"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database exists
if [ ! -f "library.db" ]; then
    echo "🗄️  Creating database..."
    echo "Database will be created on first run"
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "📱 App will be available at: http://localhost:3000"
echo "📊 API endpoints at: http://localhost:3000/api"
echo ""
echo "✨ Features:"
echo "  - Multi-user support"
echo "  - ISBN lookup"
echo "  - Reading status tracking"
echo "  - Personal shelves"
echo "  - Tags & organization"
echo "  - Family activity feed"
echo ""
echo "🌙 First time setup:"
echo "  1. Open http://localhost:3000"
echo "  2. Click 'Sign up' to create your account"
echo "  3. First user becomes admin automatically"
echo "  4. Family members can create their own accounts"
echo ""
echo "======================================"
echo ""

npm run dev
