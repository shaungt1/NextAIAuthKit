
---

### **Shell Script: `add_data.sh`**
This script **automates the Prisma setup process**, making it easy for users to get started with Prisma without manually running each command.

```bash
#!/bin/bash

echo "🚀 Starting Prisma Quick Setup..."

# Install dependencies if not installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Initialize Prisma
if [ ! -d "prisma" ]; then
    echo "🔧 Initializing Prisma..."
    npx prisma init
fi

# Apply migrations
echo "📌 Applying migrations..."
npx prisma migrate dev --name init

# Generate Prisma client
echo "⚡ Generating Prisma client..."
npx prisma generate

# Seed database
if [ -f "prisma/seed.js" ]; then
    echo "🌱 Seeding database..."
    node prisma/seed.js
else
    echo "⚠️ Seed file not found. Skipping..."
fi

echo "✅ Prisma setup completed!"
