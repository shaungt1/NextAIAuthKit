import requests

def test_chat_endpoint():
    """
    This function sends a POST request to the /chat endpoint of your FastAPI app,
    including a system prompt and a user input. It prints out the AI's response.
    """
    url = "http://localhost:8000/chat"  # Adjust if your server is on a different host/port

    # JSON body for the POST request; system_prompt is optional.
    payload = {
        "system_prompt": "You are an AI that provides concise and clear answers.",
        "user_input": "Hello! Can you tell me a fun fact about astronomy?"
    }

    # Send the POST request to the /chat endpoint
    response = requests.post(url, json=payload)

    # Check for an HTTP status code of 200 and print the JSON response
    if response.status_code == 200:
        print("Success! Response from the API:")
        print(response.json())
    else:
        print(f"Error! Status code: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_chat_endpoint()
