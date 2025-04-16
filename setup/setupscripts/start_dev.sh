#!/bin/bash

# Exit on error
set -e

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Installing dependencies..."
  npm install
else
  echo "node_modules found. Skipping npm install."
fi

# Start development server
echo "Starting development server..."
npm run dev
if [ $? -ne 0 ]; then
  echo "Failed to start development server."
  exit 1
fi
echo "Development server started successfully."
echo "🚀 Development server is running. You can access it at: http://localhost:1880"