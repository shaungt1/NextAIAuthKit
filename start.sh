#!/bin/bash

################################################################################
# 🚀 Unified Project Bootstrapper: start.sh
# Supports:
#  - First-Time Setup (Node, Python, Env, Prisma, Theme)
#  - Launch Dev Servers
#  - Theme Switcher
#  - DB Migration (Prisma)
#  - Full Docker Build (Next.js + FastAPI)
################################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SETUP_DIR="$SCRIPT_DIR/setup/setupscripts"
API_DIR="$SCRIPT_DIR/api"
NEXT_DIR="$SCRIPT_DIR"

# Detect OS for sed + python + docker compat
unameOut="$(uname -s)"
case "${unameOut}" in
    Darwin*)  OS_TYPE="macOS";;
    Linux*)   OS_TYPE="Linux";;
    MINGW*|MSYS*|CYGWIN*) OS_TYPE="Windows";;
    *) OS_TYPE="unknown";;
esac

echo ""
echo "🧠 Detected OS: $OS_TYPE"

# Auto-detect setup state
IS_FIRST_RUN=false
[[ ! -d "$NEXT_DIR/node_modules" || ! -f "$NEXT_DIR/.env" || ! -d "$NEXT_DIR/PYENV" ]] && IS_FIRST_RUN=true

echo ""
echo "📁 Project Bootstrapper"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ "$IS_FIRST_RUN" == "true" ]]; then
  echo "⚠️  First-time setup detected..."
  echo "1) 🔧 Run First-Time Setup (envs, pyenv, npm install, prisma init)"
  read -rp "#? " CHOICE
  CHOICE="1"
else
  echo "1) 🔧 Run First-Time Setup (again)"
  echo "2) 🧪 Start Development Servers"
  echo "3) 🎨 Change Theme"
  echo "4) 🔁 Update Prisma DB"
  echo "5) 🚀 Deploy with Docker"
  echo "0) ❌ Exit"
  read -rp "#? " CHOICE
fi

run_first_time_setup() {
  echo ""
  echo "🔧 Running first-time setup..."
  bash "$SETUP_DIR/first-time-setup.sh"
}

run_dev_servers() {
  echo ""
  echo "🧪 Starting Dev Servers..."
  bash "$SETUP_DIR/start_dev.sh" &  # Next.js
  bash "$SETUP_DIR/start_py.sh"     # FastAPI
}

change_theme() {
  echo ""
  echo "🎨 Launching Theme CLI..."
  bash "$SETUP_DIR/setup_theme.sh"
}

update_prisma() {
  echo ""
  echo "🔁 Updating Prisma DB..."
  npx prisma generate
  npx prisma migrate dev
}

build_frontend() {
  echo ""
  echo "📦 Building Next.js frontend..."
  npm run build
}



deploy_with_docker() {
  echo ""
  echo "🐳 Dockerizing full stack..."

  # Always run relative to the directory this script is called from (the project root)
  local ROOT_DIR="$(pwd)"
  local COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

  if [[ ! -f "$COMPOSE_FILE" ]]; then
    echo "❌ Missing docker-compose.yml in project root: $COMPOSE_FILE"
    exit 1
  fi

  echo "📦 Building containers..."
  docker compose -f "$COMPOSE_FILE" build
    if [[ $? -ne 0 ]]; then
        echo "❌ Failed to build containers."
        exit 1
    fi
  echo "🚀 Starting containers..."
  docker compose -f "$COMPOSE_FILE" up -d
    if [[ $? -ne 0 ]]; then
        echo "❌ Failed to start containers."
        exit 1
    fi

  echo ""
  echo "✅ Docker containers launched!"
  echo "🌐 Web App:   http://localhost:1886"
  echo "🧠 FastAPI:   http://localhost:8000"
  echo "📖 Docs:      http://localhost:8001/docs"
}


case "$CHOICE" in
  1) run_first_time_setup ;;
  2) run_dev_servers ;;
  3) change_theme ;;
  4) update_prisma ;;
  5) deploy_with_docker ;;
  0) echo "👋 Goodbye!" && exit 0 ;;
  *) echo "❌ Invalid selection." && exit 1 ;;
esac
