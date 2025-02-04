#!/bin/bash

echo "🐍 Setting up FastAPI with Virtual Environment (PYENV)..."

# Define virtual environment name
VENV_NAME="PYENV"

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_NAME" ]; then
    echo "🔧 Creating virtual environment ($VENV_NAME)..."
    python -m venv "$VENV_NAME"
else
    echo "✅ Virtual environment ($VENV_NAME) already exists."
fi

# Detect OS and activate the virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash)
    source "$VENV_NAME/Scripts/activate"
else
    # Linux/macOS
    source "$VENV_NAME/bin/activate"
fi

echo "✅ Virtual environment ($VENV_NAME) activated."

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r api/requirements.txt

# Change directory to API and start FastAPI server
cd api || exit
echo "🚀 Starting FastAPI Server..."
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

echo "✅ FastAPI running at http://localhost:8000"
