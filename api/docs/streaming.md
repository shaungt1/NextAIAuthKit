## **README: Streaming Responses**

### **Overview**
Streaming enables the bot to send partial responses as they are generated, improving responsiveness and user experience. Instead of waiting for the full response to be computed, streaming allows users to receive output in real-time as the model processes the request.

### **How It Works in Our Application**
In the `LLMBot` class, streaming is **enabled by default** when initializing the OpenAI model. The `send_message` method utilizes the `astream()` method from `ChatOpenAI` to **yield response chunks asynchronously**.

### **Key Implementation**
- The `astream()` method is used to **stream responses in real-time**.
- The bot **yields each token** as it is received.
- After streaming completes, the final response is stored in memory.

### **Code Example**
```python
async def send_message(self, user_input: str):
    """
    Streams the model's response to the user input.
    Memory is never reset, so all prior messages are retained.
    """
    user_text = load_text(user_input)
    human_message = HumanMessage(content=user_text)
    self.update_memory(human_message)

    config = {"configurable": {"thread_id": self.thread_id}}
    state = APP.get_state(config).values
    all_msgs = state.get("messages", [])

    streamed_chunks = []
    async for response_chunk in GLOBAL_LLM.astream(all_msgs):
        streamed_chunks.append(response_chunk.content or "")
        yield response_chunk  # Send chunks to frontend

    final_response = "".join(streamed_chunks)
    self.update_memory(AIMessage(content=final_response))
```

### **References**
- LangChain Streaming Documentation: [Streaming Responses](https://python.langchain.com/docs/modules/model_io/output_parsers/streaming)
