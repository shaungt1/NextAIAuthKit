#!/bin/bash

# Exit on any error to ensure robustness
set -e

# Function to log messages with timestamps
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 🚀 Welcome Message
log "Starting the FastAPI AI API Module CLI Generator"
echo "====================================="
echo "   FastAPI AI API Module CLI Generator"
echo "====================================="
echo
log "Prompting user to choose an API type"
echo "This script helps you create a new API module."
echo
echo "📌 First, choose your API type:"
echo "  1️⃣ HTTP        → Standard RESTful route"
echo "  2️⃣ WebSocket   → Real-time route with documentation"
echo

# Prompt for API type
read -p "Select an API type (1 for HTTP, 2 for WebSocket): " API_TYPE
log "User selected API type: '$API_TYPE'"

# Validate API type
if [[ "$API_TYPE" != "1" && "$API_TYPE" != "2" ]]; then
    log "ERROR: Invalid API type selected: '$API_TYPE'"
    echo "❌ Invalid option! Please run the script again and select 1 or 2."
    exit 1
fi
if [ "$API_TYPE" == "1" ]; then
    API_FLAG="--http"
    log "API type set to HTTP"
else
    API_FLAG="--websocket"
    log "API type set to WebSocket"
fi

echo
log "Prompting user to choose a module setup style"
echo "📦 Choose your module setup style:"
echo "  1️⃣ Minimal Setup  → Route, Service, Notes, & Changelog"
echo "  2️⃣ Full Setup     → Route, Service, Schemas, Logging, Tests, Notes, & Changelog"
echo

# Prompt for module setup style
read -p "Select a setup option (1 for Minimal, 2 for Full): " MODULE_TYPE
log "User selected module setup style: '$MODULE_TYPE'"

# Validate module type
if [[ "$MODULE_TYPE" != "1" && "$MODULE_TYPE" != "2" ]]; then
    log "ERROR: Invalid module setup style selected: '$MODULE_TYPE'"
    echo "❌ Invalid option! Please run the script again and select 1 or 2."
    exit 1
fi
if [ "$MODULE_TYPE" == "1" ]; then
    SETUP_FLAG="--minimal"
    log "Setup style set to Minimal"
else
    SETUP_FLAG="--full"
    log "Setup style set to Full"
fi

# Prompt for module name
echo
log "Prompting user to enter the module name"
read -p "Enter the module name (e.g., analytics, summarizer): " MODULE_NAME
log "User entered module name: '$MODULE_NAME'"

# Ensure module name is not empty
if [ -z "$MODULE_NAME" ]; then
    log "ERROR: Module name is empty"
    echo "❌ Module name cannot be empty!"
    exit 1
fi

# Normalize module name (lowercase, replace spaces with underscores)
MODULE_NAME=$(echo "$MODULE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
log "Normalized module name: '$MODULE_NAME'"

# Detect Python interpreter
log "Detecting available Python interpreter"
if command -v python &>/dev/null && python --version &>/dev/null; then
    PYTHON_CMD="python"
    log "Using 'python' as the Python interpreter"
elif command -v python3 &>/dev/null && python3 --version &>/dev/null; then
    PYTHON_CMD="python3"
    log "Using 'python3' as the Python interpreter"
elif command -v py &>/dev/null && py --version &>/dev/null; then
    PYTHON_CMD="py"
    log "Using 'py' as the Python interpreter"
else
    log "ERROR: No functional Python interpreter found"
    echo "❌ No functional Python interpreter found! Please install Python and ensure it's in your PATH."
    exit 1
fi

# Display configuration before execution
echo
log "Configuration summary:"
echo "📂 Creating module: $MODULE_NAME"
echo "🧠 Setup style: $SETUP_FLAG"
echo "🧠 API type: $API_FLAG"
echo "🔍 Using interpreter: $PYTHON_CMD"
echo

# Run the Python CLI script
log "Executing Python CLI script: $PYTHON_CMD scripts/_cli.py $MODULE_NAME $SETUP_FLAG $API_FLAG"
$PYTHON_CMD scripts/_cli.py "$MODULE_NAME" "$SETUP_FLAG" "$API_FLAG"
log "Python CLI script executed successfully"

# Success message
echo
log "Module creation completed"
echo "✅ Module '$MODULE_NAME' has been created successfully!"
echo "📌 Check 'api/v1/' & 'services/$MODULE_NAME/' for your new API files."
echo "📜 Changelog updated in 'changelog.md'"
echo
echo "🎯 Next Steps:"
echo "- Edit the generated files in 'api/v1/' and 'services/$MODULE_NAME/'."
echo "- Implement business logic in '${MODULE_NAME}_service.py'."
echo "- Add models in '${MODULE_NAME}_schemas.py' (if full setup was chosen)."
echo "- Run tests: 'pytest services/$MODULE_NAME/tests/test_${MODULE_NAME}.py'."
echo
echo "🚀 You're ready to go!"
log "Script finished successfully"