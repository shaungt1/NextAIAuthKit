## **README: Memory Management with LangGraph**

### **Overview**
Memory is crucial for maintaining context across interactions, allowing the bot to recall past conversations and provide **context-aware responses**. LangGraph offers a robust mechanism for persisting message history.

### **How It Works in Our Application**
- The `MemorySaver` from `langgraph.checkpoint.memory` is used to **store conversation history**.
- Each instance of `LLMBot` is assigned a **unique thread_id**, ensuring user conversations remain isolated.
- The `update_memory()` method saves **new messages**, and `send_message()` retrieves previous ones before generating a response.

### **Key Implementation**
- **Memory is stored in LangGraph’s `MemorySaver`**, allowing the bot to persist conversation state.
- **Each conversation has a unique `thread_id`**, preventing cross-user message conflicts.

### **Code Example**
```python
def update_memory(self, message):
    """
    Stores a message (System, Human, or AI) in the bot's memory.
    This ensures the model retains full context for the current thread_id.
    """
    config = {"configurable": {"thread_id": self.thread_id}}
    state = APP.get_state(config).values
    current_msgs = state.get("messages", [])

    updated_messages = current_msgs + [message]
    APP.update_state(config, {"messages": updated_messages})

    # Log full conversation history
    new_state = APP.get_state(config).values
    print(f"🔎 Full conversation for thread_id='{self.thread_id}':")
    for idx, msg in enumerate(new_state["messages"], start=1):
        print(f"   {idx}. [{msg.type}] {msg.content}")
```

### **References**
- LangChain Message History: [Managing Memory](https://python.langchain.com/docs/how_to/message_history/)
- LangGraph for Memory Persistence: [LangGraph Memory](https://python.langchain.com/docs/expression_language/langgraph)

