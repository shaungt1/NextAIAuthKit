#!/bin/bash

echo "🐍 FastAPI Setup Script"

# Check if Python is installed
if ! command -v python3 &>/dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 and rerun this script."
    exit 1
fi

echo "✅ Python3 detected."

# Create a virtual environment if not exists
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment detected, skipping creation."
fi

# Activate virtual environment
if [[ "$PLATFORM" == "Windows" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r fastapi/requirements.txt

# Start FastAPI
echo "🚀 Starting FastAPI Server..."
cd fastapi
uvicorn main:app --reload --port 8000 &

echo "✅ FastAPI running at http://localhost:8000"
