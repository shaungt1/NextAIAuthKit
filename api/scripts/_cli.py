import sys
import os
import datetime

# Add scripts directory to Python path for module import
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

# Import templates (assuming these are defined in _cli_templates.py)
from _cli_templates import (
    ROUTE_TEMPLATE,
    SERVICE_TEMPLATE,
    SCHEMA_TEMPLATE,
    TEST_TEMPLATE,
    EXAMPLE_DATA_JSON,
    NOTES_TEMPLATE,
    CHANGELOG_ENTRY,
    WEBSOCKET_ROUTE_TEMPLATE
)

def create_module(module_name, setup_flag, api_flag):
    """
    Create a new FastAPI module with the specified setup style and API type.

    Args:
        module_name (str): The name of the module to create.
        setup_flag (str): Either '--minimal' or '--full' to determine the setup style.
        api_flag (str): Either '--http' or '--websocket' to determine the API type.

    Generates:
        - Routes in `api/v1/`
        - Services in `services/<module_name>/`
        - Optional schemas, tests, and data files for full setup.
        - Updates `changelog.md`.
    """
    # Base directory setup
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    v1_dir = os.path.join(base_path, "v1")  # Routes directory
    service_dir = os.path.join(base_path, "services", module_name)
    test_dir = os.path.join(service_dir, "tests")
    data_dir = os.path.join(service_dir, "data")
    changelog_path = os.path.join(base_path, "changelog.md")

    # Derived variables
    module_name_cap = module_name.capitalize()
    module_route_name = module_name.lower().replace(" ", "_")
    tag_name = f"{module_name_cap} WebSocket API" if api_flag == "--websocket" else f"{module_name_cap} API"

    # Create directories
    print(f"Creating directory: {v1_dir}")
    os.makedirs(v1_dir, exist_ok=True)
    print(f"Creating directory: {service_dir}")
    os.makedirs(service_dir, exist_ok=True)
    print(f"Creating directory: {test_dir}")
    os.makedirs(test_dir, exist_ok=True)
    if setup_flag == "--full":
        print(f"Creating directory: {data_dir}")
        os.makedirs(data_dir, exist_ok=True)

    # Write API route file in v1/
    route_file = os.path.join(v1_dir, f"{module_route_name}_route.py")
    print(f"Writing route file: {route_file}")
    with open(route_file, "w", encoding="utf-8") as f:
        if api_flag == "--websocket":
            f.write(WEBSOCKET_ROUTE_TEMPLATE.format(
                module_name=module_name,
                module_name_cap=module_name_cap,
                module_route_name=module_route_name,
                tag_name=tag_name
            ))
        else:
            f.write(ROUTE_TEMPLATE.format(
                module_name=module_name,
                module_name_cap=module_name_cap
            ))

    # Write service files (always created, regardless of --minimal or --full)
    print(f"Writing __init__.py in {service_dir}")
    with open(os.path.join(service_dir, "__init__.py"), "w", encoding="utf-8") as f:
        f.write(f"# Init for {module_name} module\n")

    print(f"Writing {module_name}_service.py in {service_dir}")
    with open(os.path.join(service_dir, f"{module_name}_service.py"), "w", encoding="utf-8") as f:
        f.write(SERVICE_TEMPLATE.format(
            module_name=module_name,
            module_name_cap=module_name_cap
        ))

    print(f"Writing {module_name}_notes.md in {service_dir}")
    with open(os.path.join(service_dir, f"{module_name}_notes.md"), "w", encoding="utf-8") as f:
        f.write(NOTES_TEMPLATE.format(
            module_name=module_name,
            module_name_cap=module_name_cap
        ))

    # Full setup files (only for --full)
    if setup_flag == "--full":
        # Schema file (HTTP only, skipped for WebSocket)
        if api_flag == "--http":
            print(f"Writing {module_name}_schemas.py in {service_dir}")
            with open(os.path.join(service_dir, f"{module_name}_schemas.py"), "w", encoding="utf-8") as f:
                f.write(SCHEMA_TEMPLATE.format(module_name_cap=module_name_cap))

        # Test file
        print(f"Writing test_{module_name}.py in {test_dir}")
        with open(os.path.join(test_dir, f"test_{module_name}.py"), "w", encoding="utf-8") as f:
            f.write(TEST_TEMPLATE.format(module_name=module_name))

        # JSON data file
        print(f"Writing {module_name}.json in {data_dir}")
        with open(os.path.join(data_dir, f"{module_name}.json"), "w", encoding="utf-8") as f:
            f.write(EXAMPLE_DATA_JSON.format(module_name_cap=module_name_cap))

    # Update changelog (always updated)
    release_date = datetime.datetime.now().strftime("%B %d, %Y")
    method = "WebSocket" if api_flag == "--websocket" else "GET"
    api_type_cap = "WebSocket" if api_flag == "--websocket" else "HTTP"

    print(f"Updating changelog: {changelog_path}")
    if os.path.exists(changelog_path):
        with open(changelog_path, "r", encoding="utf-8") as f:
            existing = f.read()
    else:
        existing = ""

    new_log = CHANGELOG_ENTRY.format(
        module_name=module_name,
        module_name_cap=module_name_cap,
        release_date=release_date,
        method=method,
        api_type_cap=api_type_cap
    ) + "\n" + existing

    with open(changelog_path, "w", encoding="utf-8") as f:
        f.write(new_log)

    print(f"✅ Module '{module_name}' created successfully!")

if __name__ == "__main__":
    # Check command-line arguments
    if len(sys.argv) != 4:
        print("Usage: python scripts/_cli.py <module_name> --minimal/--full --http/--websocket")
        sys.exit(1)

    module_name = sys.argv[1]
    setup_flag = sys.argv[2]
    api_flag = sys.argv[3]

    # Validate flags
    if setup_flag not in ["--minimal", "--full"]:
        print(f"❌ Invalid setup flag: {setup_flag}. Use --minimal or --full.")
        sys.exit(1)
    if api_flag not in ["--http", "--websocket"]:
        print(f"❌ Invalid API flag: {api_flag}. Use --http or --websocket.")
        sys.exit(1)

    # Create the module
    create_module(module_name, setup_flag, api_flag)