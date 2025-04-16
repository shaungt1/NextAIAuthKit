#!/bin/bash

echo "🐍 Setting up FastAPI with Virtual Environment (PYENV)..."

# Always run from root regardless of where the script lives
cd "$(dirname "$0")/../.." || exit 1

VENV_NAME="PYENV"
VENV_UNIX_ACTIVATE="$VENV_NAME/bin/activate"
VENV_WIN_ACTIVATE="$VENV_NAME/Scripts/activate"
REQUIREMENTS_FILE="api/requirements.txt"
ENV_TEMPLATE_PATH="setup/setupscripts/.env.fastapi-template"
ENV_TARGET_PATH="api/.env.fastapi"

# Step 1: Detect OS
OS_TYPE="$(uname | tr '[:upper:]' '[:lower:]')"
IS_WINDOWS=false
if [[ "$OS_TYPE" == *"mingw"* || "$OS_TYPE" == *"msys"* || "$OS_TYPE" == *"cygwin"* ]]; then
    IS_WINDOWS=true
fi

# Step 2: Deactivate Conda if active
if [[ -n "$CONDA_DEFAULT_ENV" ]]; then
    echo "🔌 Conda environment detected: $CONDA_DEFAULT_ENV. Deactivating..."
    conda deactivate
fi

# Step 3: Function to check venv activation
is_venv_active() {
    [[ -n "$VIRTUAL_ENV" ]]
}

# Step 4: Activate PYENV
activate_venv() {
    if is_venv_active; then
        echo "✅ Virtual environment already active: $VIRTUAL_ENV"
        return 0
    fi

    echo "🔌 Activating virtual environment..."
    if $IS_WINDOWS; then
        if [ -f "$VENV_WIN_ACTIVATE" ]; then
            source "$VENV_WIN_ACTIVATE"
        else
            echo "❌ Activation script not found: $VENV_WIN_ACTIVATE"
            return 1
        fi
    else
        if [ -f "$VENV_UNIX_ACTIVATE" ]; then
            source "$VENV_UNIX_ACTIVATE"
        else
            echo "❌ Activation script not found: $VENV_UNIX_ACTIVATE"
            return 1
        fi
    fi
    echo "✅ Virtual environment activated: $VIRTUAL_ENV"
    return 0
}

# Step 5: Setup or activate virtual environment
if [ ! -d "$VENV_NAME" ]; then
    echo "🔧 Creating virtual environment: $VENV_NAME"
    python -m venv "$VENV_NAME"
    if ! activate_venv; then exit 1; fi

    echo "📦 Installing dependencies from $REQUIREMENTS_FILE..."
    pip install --upgrade pip
    pip install -r "$REQUIREMENTS_FILE"

    # Step 5.1: Generate .env.fastapi if it doesn't exist
    if [ ! -f "$ENV_TARGET_PATH" ]; then
        echo "📝 Creating api/.env.fastapi from template..."
        cp "$ENV_TEMPLATE_PATH" "$ENV_TARGET_PATH"
        echo "✅ .env.fastapi created at: $ENV_TARGET_PATH"
    else
        echo "✅ .env.fastapi already exists. Skipping."
    fi
else
    echo "✅ Virtual environment ($VENV_NAME) already exists."
    if ! activate_venv; then exit 1; fi
fi

# Step 6: Start FastAPI
echo "🚀 Starting FastAPI Server..."
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

if [ $? -ne 0 ]; then
    echo "❌ FastAPI server failed to start."
    exit 1
fi


# Wait a few seconds to ensure server starts before opening docs
sleep 3


# Step 6.1: Open FastAPI docs in a separate terminal
# Open FastAPI docs in a separate terminal
echo "Opening FastAPI docs..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://127.0.0.1:8032/docs
elif command -v open &> /dev/null; then
    open http://127.0.0.1:8032/docs
elif command -v start &> /dev/null; then
    start http://127.0.0.1:8032/docs
else
    echo "Unable to detect the command to open the browser. Please open http://127.0.0.1:8032/docs manually."
fi

echo "Development environment setup complete."


# Step 7: Next instructions
echo ""
echo "✅ FastAPI running at: http://localhost:8000"
echo ""
echo "👉 Next Steps:"
echo "📁 Navigate to: api/cli.sh"
echo "🛠️  Run: ./cli.sh to use the module generator"
echo "⚙️  The generator creates documented, zero-latency, functional microservices"
echo "🚀 Each module includes routes, models, services, and docs"
echo "💡 Build microservices in seconds with zero config!"




# echo "🐍 Setting up FastAPI with Virtual Environment (PYENV)..."

# VENV_NAME="PYENV"
# VENV_UNIX_ACTIVATE="$VENV_NAME/bin/activate"
# VENV_WIN_ACTIVATE="$VENV_NAME/Scripts/activate"
# REQUIREMENTS_FILE="api/requirements.txt"
# FASTAPI_APP="main:app"

# # Step 1: Detect OS
# OS_TYPE="$(uname | tr '[:upper:]' '[:lower:]')"
# IS_WINDOWS=false
# if [[ "$OS_TYPE" == *"mingw"* || "$OS_TYPE" == *"msys"* || "$OS_TYPE" == *"cygwin"* ]]; then
#     IS_WINDOWS=true
# fi

# # Step 2: Deactivate Conda if active
# if [[ -n "$CONDA_DEFAULT_ENV" ]]; then
#     echo "🔌 Conda environment detected: $CONDA_DEFAULT_ENV. Deactivating..."
#     conda deactivate
# fi

# # Step 3: Function to check venv activation
# is_venv_active() {
#     [[ -n "$VIRTUAL_ENV" ]]
# }

# # Step 4: Activate PYENV
# activate_venv() {
#     if is_venv_active; then
#         echo "✅ Virtual environment already active: $VIRTUAL_ENV"
#         return 0
#     fi

#     echo "🔌 Activating virtual environment..."
#     if $IS_WINDOWS; then
#         if [ -f "$VENV_WIN_ACTIVATE" ]; then
#             source "$VENV_WIN_ACTIVATE"
#         else
#             echo "❌ Activation script not found: $VENV_WIN_ACTIVATE"
#             return 1
#         fi
#     else
#         if [ -f "$VENV_UNIX_ACTIVATE" ]; then
#             source "$VENV_UNIX_ACTIVATE"
#         else
#             echo "❌ Activation script not found: $VENV_UNIX_ACTIVATE"
#             return 1
#         fi
#     fi
#     echo "✅ Virtual environment activated: $VIRTUAL_ENV"
#     return 0
# }

# # Step 5: Setup or activate virtual environment
# if [ ! -d "$VENV_NAME" ]; then
#     echo "🔧 Creating virtual environment: $VENV_NAME"
#     python -m venv "$VENV_NAME"
#     if ! activate_venv; then exit 1; fi

#     echo "📦 Installing dependencies from $REQUIREMENTS_FILE..."
#     pip install --upgrade pip
#     pip install -r "$REQUIREMENTS_FILE"
# else
#     echo "✅ Virtual environment ($VENV_NAME) already exists."
#     if ! activate_venv; then exit 1; fi
# fi

# # Step 6: Start FastAPI
# echo "🚀 Starting FastAPI Server..."
# python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

# if [ $? -ne 0 ]; then
#     echo "❌ FastAPI server failed to start."
#     exit 1
# fi

# # Step 7: Next instructions
# echo ""
# echo "✅ FastAPI running at: http://localhost:8000"
# echo ""
# echo "👉 Next Steps:"
# echo "📁 Navigate to: api/cli.sh"
# echo "🛠️  Run: ./cli.sh to use the module generator"
# echo "⚙️  The generator creates documented, zero-latency, functional microservices"
# echo "🚀 Each module includes routes, models, services, and docs"
# echo "💡 Build microservices in seconds with zero config!"
