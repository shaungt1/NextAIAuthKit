import re
import json
from datetime import datetime
import time


def extract_json_from_text(text, json_root_key):
    '''
    This function is used to extract a JSON snippet from a text.
    '''
    # Define a regular expression pattern to match the JSON snippet
    # pattern = r'{\s*"' + re.escape(json_root_key) + r'":\s*{[^}]*}\s*}'
    # Convert back to original format
    text = text.replace("{{", "{").replace("}}", "}")
    pattern = r'{{\s*"{}":\s*{{[^}}]*}}\s*}}'.format(re.escape(json_root_key))

    # Use regex to find the JSON snippet in the text
    match = re.search(pattern, text)

    if match:
        # Extract the JSON snippet from the text
        json_str = match.group()
        json_obj = json.loads(json_str)
        return json_obj
    else:
        print("No JSON snippet found in the text.")
        return None

def update_json_in_text(text, json_to_update, insert_after_text=None):
    '''
    This function is used to update a JSON snippet in a text.
    '''
    # Convert the JSON data to a string
    json_root_key = list(json_to_update.keys())[0]
    json_to_update_str = json.dumps(json_to_update, indent=4)

    # Define a regular expression pattern to match the JSON snippet
    # pattern = r'{\s*"' + re.escape(json_root_key) + r'":\s*{[^}]*}\s*}'
    pattern = r'{{\s*"{}":\s*{{[^}}]*}}\s*}}'.format(re.escape(json_root_key))

    # Use regex to find the JSON snippet in the text
    match = re.search(pattern, text)

    # Escape curly braces so that Langchain templating engine doesn't treat them as prompt variables
    json_to_update_str = json_to_update_str.replace("{", "{{").replace("}", "}}")
    if match:
        # Replace the original JSON snippet with the new JSON string
        text = re.sub(pattern, json_to_update_str, text)
    elif insert_after_text is None:
        # If no existing JSON snippet is found, insert the new JSON at the desired location
        print("No insert location specified. Appending JSON to the end of the text.")
        text = text + json_to_update_str
    else:
        # Find the location to insert the JSON snippet
        print(f"Inserting JSON after: {insert_after_text}")
        insert_location = text.find(insert_after_text)
        print(f"Insert location: {insert_location}")
        if insert_location != -1:
            insert_location += len(insert_after_text)
            text = text[:insert_location] + "\n" + json_to_update_str + text[insert_location:]
        else:
            # If no insert location is specified, append the JSON to the end of the text
            text = text + json_to_update_str
            print("Appended JSON to the end of the text.")
    return text


def create_update_json_variables(root_key, name_value_pairs, existing_json=None):
    """
    Creates or updates a JSON structure with a given root key and name-value pairs.

    :param root_key: The root key for the JSON structure.
    :param name_value_pairs: A dictionary of name-value pairs to add under the root key.
    :param existing_json: An optional existing JSON structure to update. If None, a new structure is created.
    :return: Updated or newly created JSON structure.
    """
    if existing_json is None:
        existing_json = {}

    if root_key not in existing_json:
        existing_json[root_key] = {}

    existing_json[root_key].update(name_value_pairs)
    return existing_json

# Use to collect timestamps for ever transaction in the conversation
def format_timestamp(timestamp):
    # Convert timestamp to datetime object
    dt_object = datetime.fromtimestamp(timestamp)
    # Format datetime into a string (minutes:seconds.milliseconds)
    formatted_time = dt_object.strftime("%H:%M:%S.%f")[:-3]   # Removing last three characters to exclude microsecond precision
    return formatted_time

current_time = time.time()
formatted_current_time = format_timestamp(current_time)

if __name__ == "__main__":
    '''
    Sample usage of the functions in this file.
    '''

    # Sample text with JSON snippet
    system_prompt = """
    Some text before the JSON snippet:
    {
        "system_variables": {
            "conversation_id": "1234234",
            "quote_id": "345345adfaf",
            "customer_id": 992343434
        }
    }
    More text after.
    """

    system_prompt = """
    Some text before the JSON snippet:
    More text after.
    """

    # system_variables_json = update_json_structure("system_variables", {"conversation_id": "1234234", "quote_id": "345345adfaf"})
    # print(system_variables_json)

    print(f"Original system prompt: {system_prompt}")

    # Define the variable to replace "system_variables" text
    variable_name = "system_variables"

    # Extract the JSON snippet from the text
    system_variables_json = extract_json_from_text(system_prompt, variable_name)

    # Updating the existing structure
    system_variables_json = create_update_json_variables("system_variables", {"customer_id": 123456789, "quote_id": "new_quote_id"}, system_variables_json)

    # Update the JSON snippet in the text
    updated_system_prompt = update_json_in_text(system_prompt, system_variables_json, insert_after_text="Some text before the JSON snippet:")

    print(f"Updated system prompt: {updated_system_prompt}")
