#!/bin/bash

# 📍 Always start from root, even though this file lives in ./setup/setupscripts/
cd "$(dirname "$0")/../.." || exit 1

echo "🚀 Starting First-Time Setup for NextAIAuthKit..."

# 1. Create .env from template if missing
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from template..."
    cp setup/setupscripts/.env-template .env
    echo "✅ .env created."
else
    echo "✅ .env already exists. Skipping."
fi

# 2. Install Node.js dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node modules..."
    npm install
else
    echo "✅ node_modules already present. Skipping npm install."
fi

# 3. Prompt Theme Setup
echo "🎨 Launching Theme Setup CLI..."
node setup-theme.js

# 4. Run Prisma Setup
echo "🛠 Running Prisma Setup..."
npx prisma generate
npx prisma migrate dev --name init

# 5. Seed Database Models
echo "🌱 Seeding database models..."
node setup/start-setup-scripts.js

# 6. Show Developer Handoff
echo ""
echo "🎉 Setup Complete!"
echo "👉 You can now start developing:"
echo "🔹 Add pages to:       src/app/<yourpage>/page.tsx"
echo "🔹 Define layouts in:  src/app/layout.tsx"
echo "🔹 Add routes in:      src/app/routes.ts"
echo "🔹 Add components in:  src/app/components/"
echo "🔹 SSO, Roles, and JWT already wired in."
echo "🔐 Protected vs Public routing system is prebuilt."
echo ""
echo "▶️ Start dev environment: run ./setup/setupscripts/start_dev.sh"
