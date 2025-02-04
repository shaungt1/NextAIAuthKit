#!/bin/bash

echo "🚀 NextAIAuthKit Setup Script"

# Detect OS
OS="$(uname -s)"
case "$OS" in
    Linux*)     PLATFORM="Linux" ;;
    Darwin*)    PLATFORM="Mac" ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*) PLATFORM="Windows" ;;
    *)          PLATFORM="Unknown" ;;
esac

echo "Detected OS: $PLATFORM"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "🔧 Installing Node.js dependencies..."
    npm install
else
    echo "✅ Node modules detected, skipping install."
fi

# Check if .env file exists, create it if missing
if [ ! -f ".env" ]; then
    echo "🔧 Generating .env file..."
    cat <<EOT > .env
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_URL=postgres://user:password@localhost:5432/nextai
EOT
    echo "✅ .env file created."
else
    echo "✅ .env file already exists, skipping creation."
fi

# Run theme setup CLI
echo "🎨 Running Theme Setup..."
npm run theme-setup

# Prisma Setup
echo "🛠 Setting up Prisma..."
npx prisma generate
npx prisma migrate dev --name init

# Start Next.js App
echo "🚀 Starting Next.js App..."
npm run dev &

# Call Python setup script
echo "🐍 Setting up FastAPI..."
chmod +x start_py.sh
./start_py.sh

echo "🎉 Setup Complete! Visit http://localhost:1880"
