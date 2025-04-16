#!/bin/bash

# Set root directory
ROOT="."

# Date in MMDDYY format
DATE_SUFFIX=$(date +"%m%d%y")

# Output file
REPORT_FILE="fs/structure_${DATE_SUFFIX}.txt"

# Make sure 'fs' exists
if [ ! -d "fs" ]; then
  echo "❌ 'fs' directory not found!"
  exit 1
fi

echo "📁 Scanning project from: $ROOT"
echo "🚫 Excluding folders: node_modules, PYENV, .git, .vite, .next, .contentlayer, .vscode, .idea, prisma, public, src/registry"
echo "🚫 Excluding file: .editorconfig"
echo "📝 Output file: $REPORT_FILE"

# Run find: exclude all the listed folders and .editorconfig
find "$ROOT" -type f \
  ! -path "$ROOT/node_modules/*" \
  ! -path "$ROOT/PYENV/*" \
  ! -path "$ROOT/.git/*" \
  ! -path "$ROOT/.vite/*" \
  ! -path "$ROOT/.next/*" \
  ! -path "$ROOT/.contentlayer/*" \
  ! -path "$ROOT/.vscode/*" \
  ! -path "$ROOT/.idea/*" \
  ! -path "$ROOT/prisma/*" \
  ! -path "$ROOT/public/*" \
  ! -path "$ROOT/src/registry/*" \
  ! -name ".editorconfig" \
  | sort > "$REPORT_FILE"

echo "✅ Done. File list saved to: $REPORT_FILE"
echo "📁 File list:"