#!/bin/bash

################################################################################
# 🚀 Docker Compose Deployment Script
# Runs docker-compose up from the project root with environment prep and rebuild.
# - Detects project root from relative path
# - Confirms .env and .env.fastapi exist
# - Rebuilds images if requested
# - Starts containers in detached mode
################################################################################

set -e

echo ""
echo "🔍 Preparing Docker deployment..."

# Resolve to project root (2 levels up from this script's location)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

# Check docker-compose.yml exists
if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "❌ docker-compose.yml not found at $COMPOSE_FILE"
  exit 1
fi

# Check env files
FRONTEND_ENV="$ROOT_DIR/.env"
BACKEND_ENV="$ROOT_DIR/api/.env.fastapi"

[[ -f "$FRONTEND_ENV" ]] || echo "⚠️  Missing frontend .env: $FRONTEND_ENV"
[[ -f "$BACKEND_ENV" ]] || echo "⚠️  Missing backend .env.fastapi: $BACKEND_ENV"

# Prompt for rebuild
echo ""
read -rp "🔁 Rebuild images before deploy? [y/N] " REBUILD

cd "$ROOT_DIR"

echo ""
echo "🚀 Launching containers..."

if [[ "$REBUILD" =~ ^[Yy]$ ]]; then
  docker compose up --build -d
else
  docker compose up -d
fi

echo ""
echo "✅ Deployment complete!"

echo "📦 Services Running:"
echo "   ➤ Frontend:     http://localhost:1886"
echo "   ➤ FastAPI API:  http://localhost:8000"
echo "   ➤ Docs:         http://localhost:8001/docs"
echo ""
echo "🔄 To view logs, run: docker compose logs -f"