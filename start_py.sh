#!/bin/bash

echo "🐍 Setting up FastAPI with Virtual Environment (PYENV)..."

# Define virtual environment name and activate paths
VENV_NAME="PYENV"
VENV_UNIX_ACTIVATE="$VENV_NAME/bin/activate"
VENV_WIN_ACTIVATE="$VENV_NAME/Scripts/activate"

# Function to check if venv is already active
is_venv_active() {
    if [[ -n "$VIRTUAL_ENV" ]]; then
        echo "✅ Virtual environment already active: $VIRTUAL_ENV"
        return 0
    fi
    return 1
}

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_NAME" ]; then
    echo "🔧 Creating virtual environment ($VENV_NAME)..."
    python -m venv "$VENV_NAME"
else
    echo "✅ Virtual environment directory ($VENV_NAME) already exists."
fi

# Activate venv only if not already active
if ! is_venv_active; then
    echo "🔌 Activating virtual environment..."
    case "$OSTYPE" in
        msys*|cygwin*|win32)
            # Windows (Git Bash, etc.)
            if [ -f "$VENV_WIN_ACTIVATE" ]; then
                source "$VENV_WIN_ACTIVATE"
            else
                echo "❌ Activation script not found: $VENV_WIN_ACTIVATE"
                exit 1
            fi
            ;;
        linux*|darwin*)
            # Linux/macOS
            if [ -f "$VENV_UNIX_ACTIVATE" ]; then
                source "$VENV_UNIX_ACTIVATE"
            else
                echo "❌ Activation script not found: $VENV_UNIX_ACTIVATE"
                exit 1
            fi
            ;;
        *)
            echo "❌ Unsupported OS: $OSTYPE"
            exit 1
            ;;
    esac
    echo "✅ Virtual environment activated."
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r api/requirements.txt

# Change directory and run FastAPI
cd api || { echo "❌ Failed to enter api directory."; exit 1; }

echo "🚀 Starting FastAPI Server..."
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
if [ $? -ne 0 ]; then
    echo "❌ Failed to start FastAPI server."
    exit 1
fi

echo "✅ FastAPI running at http://localhost:8000"
