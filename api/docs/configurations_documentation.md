
# FastAPI Configuration Documentation

This README provides an overview of the configuration system for your FastAPI application, centered around `api/config/settings.py`. It explains how to use the settings, what each configuration does, and how it integrates with other modules. The system is designed for simplicity, speed (with minimal latency), and flexibility, drawing inspiration from Django’s `settings.py`.

## Using `settings.py`

### Overview
- **`settings.py`** is the central configuration hub, styled like Django’s settings file.
- **Manual Configuration**: Set values directly (e.g., `LOG_LEVEL = "DEBUG"`) for immediate overrides.
- **Environment Variables**: Use a `.env` file (or custom, e.g., `.env-fastapi`) to override defaults via `os.getenv()`.
- **Priority**: Manual settings in `settings.py` take precedence over `.env` values, which override the coded defaults.

### How to Use
1. **Edit `settings.py`**:
   - Open `api/config/settings.py`.
   - Change a setting, e.g., `APP_NAME = "My Custom App"`.
   - Save and run your app—changes apply instantly.

2. **Use a `.env` File**:
   - Create a `.env` file in the project root (or specify via `ENV_FILE=.env-fastapi`).
   - Add settings, e.g.:
     ```
     LOG_LEVEL=DEBUG
     APP_NAME=My Env App
     ```
   - These override `settings.py` defaults unless manually set.

3. **Access in Code**:
   - Import settings directly: `from api.config.settings import LOG_LEVEL`.
   - Use in modules, e.g., `logger.setLevel(settings.LOG_LEVEL)`.

### Example `.env`
```plaintext
ENV_FILE=.env-fastapi
APP_NAME="My FastAPI Service"
LOG_LEVEL=DEBUG
ENABLE_CORS=false
ENABLED_MIDDLEWARES=debug_middleware
ENABLE_AI_SERVICES=true
SELECTED_AI_PROVIDER=OpenAI
```

## Configuration Options

Below is each setting in `settings.py`, its purpose, and brief usage instructions.

### Dynamic .env File Selector
- **`ENV_FILE`**:
  - **Purpose**: Specifies the `.env` file to use (e.g., `.env`, `.env-fastapi`).
  - **Default**: `"env"`
  - **Usage**: Set `ENV_FILE = "myenv"` or `ENV_FILE=.env-fastapi` in `.env` to load a custom file.
  - **Example**: `ENV_FILE=.env-prod` → Loads `.env-prod`.

### Application Identity and Metadata
- **`APP_NAME`**:
  - **Purpose**: Sets the application’s name, used in docs and app title.
  - **Default**: `"AI API Service"`
  - **Usage**: `APP_NAME = "My App"` or `.env`: `APP_NAME=My App`.
- **`APP_VERSION`**:
  - **Purpose**: Version string for the app, shown in docs.
  - **Default**: `"0.1.0"`
  - **Usage**: `APP_VERSION = "1.0.0"`.
- **`APP_DESCRIPTION`**:
  - **Purpose**: Description for OpenAPI docs.
  - **Default**: `"Streaming inference w/ real-time agents"`
  - **Usage**: `APP_DESCRIPTION = "Custom description"`.
- **`CONTACT`**:
  - **Purpose**: Contact info for OpenAPI docs (dict with `name` and `email`).
  - **Default**: `{"name": "AI API Team", "email": "support@yourcompany.com"}`
  - **Usage**: `CONTACT = {"name": "Team", "email": "team@example.com"}` or `.env`: `CONTACT={"name": "Team", "email": "team@example.com"}`.

### Server Runtime Configuration
- **`HOST`**:
  - **Purpose**: Server host for Uvicorn.
  - **Default**: `"0.0.0.0"`
  - **Usage**: `HOST = "127.0.0.1"`.
- **`PORT`**:
  - **Purpose**: Server port.
  - **Default**: `8000`
  - **Usage**: `PORT = 8080`.
- **`RELOAD`**:
  - **Purpose**: Enables auto-reload for development.
  - **Default**: `False`
  - **Usage**: `RELOAD = True`.
- **`WORKERS`**:
  - **Purpose**: Number of Uvicorn workers.
  - **Default**: `1`
  - **Usage**: `WORKERS = 4`.
- **`DEBUG`**:
  - **Purpose**: Enables debug mode for FastAPI.
  - **Default**: `False`
  - **Usage**: `DEBUG = True`.

### Logging Configuration (`logging.py`)
- **`LOG_LEVEL`**:
  - **Purpose**: Sets logging verbosity (e.g., `"DEBUG"`, `"INFO"`, `"WARNING"`, `"ERROR"`, `"CRITICAL"`).
  - **Default**: `"INFO"`
  - **Usage**: `LOG_LEVEL = "DEBUG"` → Shows debug and higher messages in `logging.py`.
  - **Note**: Controls `logger` output in all modules using `get_logger()`.

### Middleware Configuration (`loaders.py` and `middleware_loader.py`)
- **`ENABLE_CORS`**:
  - **Purpose**: Toggles CORS middleware in `loaders.py`.
  - **Default**: `True`
  - **Usage**: `ENABLE_CORS = False` → Disables CORS.
- **`CORS_ALLOW_ORIGINS`**:
  - **Purpose**: List of allowed origins for CORS.
  - **Default**: `["*"]`
  - **Usage**: `CORS_ALLOW_ORIGINS = ["http://example.com"]`.
- **`CORS_ALLOW_CREDENTIALS`**:
  - **Purpose**: Allows credentials in CORS requests.
  - **Default**: `True`
  - **Usage**: `CORS_ALLOW_CREDENTIALS = False`.
- **`CORS_ALLOW_METHODS`**:
  - **Purpose**: Allowed HTTP methods for CORS.
  - **Default**: `["*"]`
  - **Usage**: `CORS_ALLOW_METHODS = ["GET", "POST"]`.
- **`CORS_ALLOW_HEADERS`**:
  - **Purpose**: Allowed headers for CORS.
  - **Default**: `["*"]`
  - **Usage**: `CORS_ALLOW_HEADERS = ["Content-Type"]`.
- **`ENABLE_GZIP`**:
  - **Purpose**: Toggles GZIP compression in `loaders.py`.
  - **Default**: `True`
  - **Usage**: `ENABLE_GZIP = False`.
- **`GZIP_MINIMUM_SIZE`**:
  - **Purpose**: Minimum response size for GZIP compression.
  - **Default**: `1000`
  - **Usage**: `GZIP_MINIMUM_SIZE = 500`.
- **`ENABLE_WEBTRANSPORT_DETECTION`**:
  - **Purpose**: Toggles WebTransport detection middleware in `loaders.py`.
  - **Default**: `True`
  - **Usage**: `ENABLE_WEBTRANSPORT_DETECTION = False`.
- **`ENABLED_MIDDLEWARES`**:
  - **Purpose**: List of custom middleware names to enable from `api/config/middleware/` in `middleware_loader.py`.
  - **Default**: `[]` (enables all if empty)
  - **Usage**: `ENABLED_MIDDLEWARES = ["debug_middleware"]` → Only `debug_middleware` loads; empty list loads all.

### API Documentation Configuration (`loaders.py`)
- **`ENABLE_API_DOCS`**:
  - **Purpose**: Toggles OpenAPI docs availability.
  - **Default**: `True`
  - **Usage**: `ENABLE_API_DOCS = False` → Disables `/docs`, `/redoc`, etc.
- **`DOCS_URL`**:
  - **Purpose**: URL for Swagger UI docs.
  - **Default**: `"/docs"` (or `None` if docs disabled)
  - **Usage**: `DOCS_URL = "/swagger"`.
- **`REDOC_URL`**:
  - **Purpose**: URL for ReDoc docs.
  - **Default**: `"/redoc"`
  - **Usage**: `REDOC_URL = "/redoc-custom"`.
- **`OPENAPI_URL`**:
  - **Purpose**: URL for OpenAPI JSON schema.
  - **Default**: `"/openapi.json"`
  - **Usage**: `OPENAPI_URL = "/schema.json"`.
- **`SWAGGER_JS_URL`**/**`SWAGGER_CSS_URL`**/**`REDOC_JS_URL`**/**`FAVICON_URL`**/**`SWAGGER_UI_PARAMETERS`**:
  - **Purpose**: Customize Swagger/ReDoc UI (e.g., CDN URLs, favicon, UI params).
  - **Default**: `None`
  - **Usage**: `SWAGGER_JS_URL = "https://cdn.example.com/swagger.js"`, `SWAGGER_UI_PARAMETERS = {"defaultModelsExpandDepth": -1}`.

### Exception Handlers Configuration (`handlers.py`)
- **`USE_CUSTOM_EXCEPTION_HANDLERS`**:
  - **Purpose**: Toggles custom exception handlers in `handlers.py`.
  - **Default**: `True`
  - **Usage**: `USE_CUSTOM_EXCEPTION_HANDLERS = False` → Disables custom handlers for `UnauthorizedException`, etc.

### AI Services Configuration (`ai_services.py`)
- **`ENABLE_AI_SERVICES`**:
  - **Purpose**: Toggles all AI services in `ai_services.py`.
  - **Default**: `True`
  - **Usage**: `ENABLE_AI_SERVICES = False` → `get_ai_services()` returns `{}`.
- **`SELECTED_AI_PROVIDER`**:
  - **Purpose**: Filters AI services to a specific provider (e.g., `"OpenAI"`).
  - **Default**: `None` (all providers)
  - **Usage**: `SELECTED_AI_PROVIDER = "OpenAI"` → Limits to OpenAI models.
- **`SELECTED_AI_MODEL`**:
  - **Purpose**: Filters AI services to a specific model (e.g., `"gpt-4o"`).
  - **Default**: `None` (all models)
  - **Usage**: `SELECTED_AI_MODEL = "gpt-4o"` → Limits to that model.

## Functional Programming and `@lru_cache()`
- **When Used**:
  - **`ai_services.py`**: `get_ai_services()` uses `@lru_cache()` to cache the service registry, avoiding recomputation. Functional programming keeps it stateless and fast.
  - **`logging.py`**: `get_logger()` uses `@lru_cache()` to cache logger instances per name, reducing setup latency. Functional approach avoids class-based complexity.
- **Why Functional**:
  - **Speed**: No object instantiation overhead; pure functions are lightweight.
  - **Simplicity**: Stateless, predictable outputs (e.g., `get_ai_services()` always returns the same dict for the same settings).
  - **Latency**: `@lru_cache()` ensures millisecond-level performance by memoizing results.
- **Class-Based Alternative**:
  - Used in `loaders.py` (middleware classes), `handlers.py` (exception handlers), and `exceptions.py` (exception classes) where state or FastAPI’s framework requires it (e.g., `BaseHTTPMiddleware`).
  - Trade-off: Slightly more startup latency for instantiation, but necessary for FastAPI’s middleware/handler system.

## Usage Examples

### Basic Setup
```python
# main.py
from fastapi import FastAPI
from api.config.settings import APP_NAME, HOST, PORT, RELOAD
from api.config.loaders import apply_middlewares, apply_api_docs

app = FastAPI(title=APP_NAME)
apply_middlewares(app)
apply_api_docs(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=RELOAD)
```

### Custom Logging
```python
# some_module.py
from api.config.logging import get_logger
logger = get_logger("MyModule")
logger.info("Module initialized")  # Controlled by LOG_LEVEL
```

### Middleware Toggle
- `settings.py`: `ENABLED_MIDDLEWARES = ["debug_middleware"]` → Only `debug_middleware` loads.
- `.env`: `ENABLED_MIDDLEWARES=` (empty) → All middleware in `api/config/middleware/` load.

### AI Services
```python
# some_route.py
from api.config.ai_services import get_ai_services
services = get_ai_services()  # Full registry or filtered by settings
provider = services["HostedLLMProviders"]["OpenAI"]
```

## Notes
- **Performance**: Functional with `@lru_cache()` is used for static data (e.g., `ai_services.py`), while class-based is used for dynamic behavior (e.g., middleware).
- **Flexibility**: Settings can be adjusted manually or via `.env` without code changes.
- **Next Steps**: Add new settings as needed for future modules (e.g., database configs).

This configuration system balances speed, simplicity, and control—edit `settings.py` or `.env` to suit your needs!