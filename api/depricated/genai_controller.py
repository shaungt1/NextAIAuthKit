import os
import asyncio
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_community.document_loaders import TextLoader
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# GENERITIVE AI CONTROLLER DOES NOT STREAM
# Set the path to the root of the repository relative to this script's location
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Load environment variables from the .env file located in the root directory of the repository
dotenv_path = os.path.join(ROOT_DIR, '.env')
load_dotenv(dotenv_path)

# Debug: Confirm the environment variable is loaded
print(f"✅ API Key Loaded: {bool(os.getenv('OPENAI_API_KEY'))}")

def load_text(input_value: str) -> str:
    """
    This helper function checks whether the provided input is a valid file path. 
    If it is, the text is loaded from that file using TextLoader; otherwise, the 
    input is returned directly as plain text. 
    """
    if os.path.exists(input_value):
        loader = TextLoader(input_value)
        docs = loader.load()
        return " ".join(doc.page_content for doc in docs)
    else:
        return input_value

class LLMBot:
    """
    The LLMBot class encapsulates the functionality for asynchronous text in, text out 
    communication with a language model. It supports passing in either a plain text 
    string or a file path for both the system prompt and user inputs. The conversation 
    state is tracked so that each message can build upon the previous context, but in 
    this basic design, once the program terminates or the instance is discarded, 
    conversation state is lost unless otherwise preserved.
    """

    def __init__(self, api_key: str, model_name: str = "gpt-4o", system_prompt: str = None, 
                 temperature: float = 0.0, top_p: float = 1.0, max_length: int = 4096, streaming: bool = True):
        """
        Initializes the LLMBot with API key, model parameters, and an optional system prompt.
        
        Args:
            api_key (str): The API key required to interact with OpenAI's model.
            model_name (str): The name of the model to use (default is "gpt-4o").
            system_prompt (str, optional): Initial system prompt for the conversation (default is None).
            temperature (float, optional): Sampling temperature for randomness in responses (default is 0.7).
            top_p (float, optional): Probability mass for nucleus sampling (default is 1.0).
            max_length (int, optional): Maximum number of tokens in responses (default is 4096).
            streaming (bool, optional): Whether to use streaming responses (default is True).
        """
        if not api_key:
            raise ValueError("An API key is required to initialize the bot.")

        self.api_key = api_key
        self.temperature = temperature
        self.top_p = top_p
        self.max_length = max_length
        self.streaming = streaming
        
       
        self.model = ChatOpenAI(
            model=model_name, 
            api_key=api_key,
            streaming=self.streaming,
            temperature=self.temperature,
            top_p=self.top_p,
            max_completion_tokens=self.max_length
        )
  
        self.conversation = []

        # If a system prompt is provided (plain text or file path), load it appropriately.
        if system_prompt:
            prompt_text = load_text(system_prompt)
            self.conversation.append(SystemMessage(content=prompt_text))


    async def send_message(self, user_input: str):

        """
        This asynchronous method processes a user input message, which may be plain text or a file path.
        It appends the message to the conversation as a HumanMessage, streams the language model's response
        to the console in real time, and returns the full response as a string.
        """
        # Load the user input from a file if needed, or use it directly as plain text.
        user_text = load_text(user_input)
        human_message = HumanMessage(content=user_text)
        self.conversation.append(human_message)



        # Send the user input to the model and stream the response in real time
        async for response in self.model.astream(self.conversation):
            yield response  # Yield each chunk instead of returning full response
        
        self.conversation.append(AIMessage(content="".join([chunk.content async for chunk in self.model.astream(self.conversation)])))


    def reset_conversation(self, system_prompt: str = None):
        """
        This method resets the conversation history, optionally seeding it with a new system prompt,
        which may also be provided as plain text or a file path.
        """
        self.conversation = []
        if system_prompt:
            prompt_text = load_text(system_prompt)
            self.conversation.append(SystemMessage(content=prompt_text))







# =================================================================================================
# /api/main.py
# MAIN FUNCTION
# This main function demonstrates how to use the LLMBot with environment variables.
# =================================================================================================
async def main():
    """
    Demonstration of how to use the LLMBot with environment variables. You can specify 
    SYSTEM_PROMPT and USER_INPUT as either file paths or plain text in your .env or environment. 
    """
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("API key not found in environment variables. Please set the OPENAI_API_KEY variable.")
    
    # Retrieve system prompt and user input from environment variables (either file paths or plain text).
    system_prompt_source = os.getenv("SYSTEM_PROMPT", "You are an AI bot. Answer all questions succinctly and accurately.")
    user_input_source = os.getenv("USER_INPUT", "Hello, can you tell me a fun fact about space?")

    # Create an LLMBot with the system prompt (if any), then send the user input.
    bot = LLMBot(api_key=api_key, system_prompt=system_prompt_source)
    response = await bot.send_message(user_input_source)
    print("\n\nFinal Response:", response)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except RuntimeError:
        print("⚠️ Event loop already running. Run `await main()` in an async environment.")
