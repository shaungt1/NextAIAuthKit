import os
import asyncio
import uuid
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_community.document_loaders import TextLoader
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph

# ---------------------------------------------------------------------------
# A global MemorySaver & Workflow to hold ALL conversation threads separately.
# Each conversation_id is stored as a separate "thread" in memory.
# ---------------------------------------------------------------------------

GLOBAL_MEMORY = MemorySaver()
GLOBAL_WORKFLOW = StateGraph(state_schema=MessagesState)

# We'll define a single node that calls the LLM with the entire conversation:
def call_model(state: MessagesState):
    print("📝 Calling model with stored messages for conversation...")
    response = GLOBAL_LLM.invoke(state["messages"])
    print(f"🤖 AI Response: {response.content}")
    return {"messages": state["messages"] + [response]}

GLOBAL_WORKFLOW.add_edge(START, "model")
GLOBAL_WORKFLOW.add_node("model", call_model)

# Compile once, referencing the same MemorySaver for all threads:
GLOBAL_APP = GLOBAL_WORKFLOW.compile(checkpointer=GLOBAL_MEMORY)

# We set up a global LLM that we only initialize once we know the API key/model:
GLOBAL_LLM = None

def load_text(input_value: str) -> str:
    """
    Checks if 'input_value' is a path; if so, load its text content. 
    Otherwise, return input_value as-is.
    """
    if os.path.exists(input_value):
        loader = TextLoader(input_value)
        docs = loader.load()
        return " ".join(doc.page_content for doc in docs)
    return input_value


class LLMBot:
    """
    A class that uses a unique conversation_id per user/session to keep
    their conversation in separate memory. To continue the same conversation,
    the client must pass the same conversation_id on each request.
    """

    def __init__(
        self,
        api_key: str,
        model_name: str = "gpt-4o",
        system_prompt: str = None,
        temperature: float = 0.0,
        top_p: float = 1.0,
        max_length: int = 4096,
        streaming: bool = True,
        conversation_id: str = None
    ):
        if not api_key:
            raise ValueError("An API key is required to initialize the bot.")

        # Lazily initialize the global LLM if it's still None:
        global GLOBAL_LLM
        if GLOBAL_LLM is None:
            GLOBAL_LLM = ChatOpenAI(
                model=model_name,
                api_key=api_key,
                streaming=streaming,
                temperature=temperature,
                top_p=top_p,
                max_completion_tokens=max_length
            )

        # Each instance can either use an existing conversation_id 
        # or generate a new one if none was provided:
        self.conversation_id = conversation_id or str(uuid.uuid4())

        # If a system prompt is provided, we store it as a system message:
        if system_prompt:
            prompt_text = load_text(system_prompt)
            self.update_memory(SystemMessage(content=prompt_text))

        print(f"🚀 LLMBot initialized with conversation_id={self.conversation_id}")

    def update_memory(self, message):
        """
        Appends a message (System/Human/AI) to this conversation's memory
        under self.conversation_id.
        """
        config = {"configurable": {"thread_id": self.conversation_id}}
        state = GLOBAL_APP.get_state(config).values
        current_msgs = state.get("messages", [])
        updated_msgs = current_msgs + [message]

        print(f"📌 Storing message under conversation_id={self.conversation_id}: {message.content}")
        GLOBAL_APP.update_state(config, {"messages": updated_msgs})

        # Debug: Print entire conversation for clarity
        new_state = GLOBAL_APP.get_state(config).values
        print(f"🔎 Updated conversation {self.conversation_id}:")
        for idx, msg in enumerate(new_state["messages"], start=1):
            print(f"  {idx}. [{msg.type}] {msg.content}")

    async def send_message(self, user_input: str):
        """
        Receives the user_input, updates memory with a HumanMessage, 
        streams the model's new answer, then stores the final AIMessage.
        """
        user_text = load_text(user_input)
        human_message = HumanMessage(content=user_text)
        self.update_memory(human_message)

        # Now retrieve the entire conversation from memory 
        # and stream the LLM's response:
        config = {"configurable": {"thread_id": self.conversation_id}}
        state = GLOBAL_APP.get_state(config).values
        print(f"🧠 Memory State (conversation_id={self.conversation_id}):")
        for msg in state["messages"]:
            print(f"  - {msg.type}: {msg.content}")

        streamed_chunks = []
        async for response_chunk in GLOBAL_LLM.astream(state["messages"]):
            # Each chunk is an AIMessage with partial content
            streamed_chunks.append(response_chunk.content or "")
            yield response_chunk  # Pass chunks to FastAPI StreamingResponse

        # Combine all chunks into one final string and store it in memory
        final_response = "".join(streamed_chunks)
        self.update_memory(AIMessage(content=final_response))

    # No reset method: we keep conversation memory indefinitely for each conversation_id.


# Optional local test usage
if __name__ == "__main__":
    load_dotenv()
    test_key = os.getenv("OPENAI_API_KEY")
    if not test_key:
        raise ValueError("No OPENAI_API_KEY found in environment.")
    
    async def demo():
        print("Starting local memory demonstration...\n")

        # Force a known conversation_id for user A
        userA_id = "alice-convo-123"
        botA = LLMBot(api_key=test_key, conversation_id=userA_id, system_prompt="You are an AI assistant.")
        
        print("\n--- A's first message ---")
        async for c in botA.send_message("Hello, I'm Alice!"):
            print(c.content, end="", flush=True)
        
        print("\n\n--- A's second message, same conversation ID ---")
        async for c in botA.send_message("What's my name?"):
            print(c.content, end="", flush=True)

        # Now user B with a different conversation_id
        userB_id = "bob-convo-456"
        botB = LLMBot(api_key=test_key, conversation_id=userB_id, system_prompt="You are an AI assistant.")
        
        print("\n\n--- B's first message, separate memory ---")
        async for c in botB.send_message("Hello, I'm Bob!"):
            print(c.content, end="", flush=True)
        
        print("\n\n--- Check if B sees anything from Alice's conversation: ---")
        async for c in botB.send_message("What was that person's name who talked to you before me?"):
            print(c.content, end="", flush=True)

    asyncio.run(demo())
