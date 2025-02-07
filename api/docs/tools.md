## **README: Tool (Function) Calling**

### **Overview**
Function calling enables the bot to interact with **external tools or APIs** to perform tasks beyond text generation. This feature allows the model to **execute functions** based on user input, enhancing its capabilities.

### **How It Works in Our Application**
- Tools (functions) are **registered** in the LLM configuration.
- The bot **detects when a function is required** and calls the appropriate method.
- Functions can include **calculations, API calls, or database lookups**.

### **Key Implementation**
- **Function tools are defined as Python functions** and registered with LangChain.
- **The model detects tool invocation needs** and executes relevant functions.

### **Code Example**
```python
from langchain.tools import Tool

def multiply_numbers(a: int, b: int) -> int:
    """Multiplies two numbers and returns the result."""
    return a * b

tool = Tool(
    name="Multiply",
    func=multiply_numbers,
    description="Multiplies two numbers and returns the result."
)

llm_with_tools = ChatOpenAI(model="gpt-4o", tools=[tool])
```

### **References**
- LangChain Tool Calling: [Tool Usage](https://python.langchain.com/docs/modules/agents/tools/)
- Function Calling in LangChain: [LLM Function Calling](https://python.langchain.com/docs/modules/agents/tools/custom_tools/)

---

Each of these **README** files provides the necessary documentation for developers working on the bot, ensuring they understand **Streaming, Memory, and Tool Calling** while having direct access to LangChain documentation and working examples. 🚀