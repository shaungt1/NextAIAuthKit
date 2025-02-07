Here is the **main README** file for the FastAPI section of **NextAIAuthKit**. This document provides an **introduction, quick start guide, file structure overview, API setup instructions, and troubleshooting steps**. It also references **Streaming, Memory, and Tool Function Calling** documentation.

---

# **NextAIAuthKit – FastAPI API**

## **Introduction**
**NextAIAuthKit** is an AI-ready FastAPI backend designed to integrate seamlessly with **Next.js** on the frontend. It provides a **structured, modular, and scalable** API that includes **authentication, memory persistence, streaming responses, and function calling** out of the box. 

This API is optimized for **real-time AI applications**, featuring:
- **Memory-based conversation tracking** using LangGraph.
- **Streaming AI responses** for real-time interaction.
- **Tool calling (Function Execution)** to extend AI capabilities.
- **Database persistence & authentication (Coming Soon).**

## **📄 Documentation References**
- [📜 Streaming Responses](./docs/STREAMING.md)  
- [🧠 Memory & Conversation History](./docs/MEMORY.md)  
- [🔧 Function Calling & Tool Execution](./docs/TOOLS.md)  

---

# **🚀 Quick Start Guide**

## **1️⃣ Setup and Install Dependencies**
Clone the repository and navigate to the API directory:
```bash
git clone https://github.com/your-repo/NextAIAuthKit.git
cd NextAIAuthKit/api
```

### **Create and Activate a Virtual Environment**
#### **On Windows (Using Bash)**
```bash
python -m venv .venv
source .venv/Scripts/activate
```
#### **On Mac/Linux**
```bash
python -m venv .venv
source .venv/bin/activate
```

### **Install Dependencies**
```bash
pip install -r requirements.txt
```

---

## **2️⃣ Running the FastAPI Server**
### **Start the API**
Use the following command to launch the FastAPI server:
```bash
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## **3️⃣ Access API Endpoints**
### **Interactive API Docs**
After starting the API, visit:
- **Swagger UI:**  
  📌 [`http://localhost:8000/docs`](http://localhost:8000/docs)  
- **Redoc Documentation:**  
  📌 [`http://localhost:8000/redoc`](http://localhost:8000/redoc)  

### **Direct API Call Example**
If the API exposes a `/chat` endpoint:
```sh
curl -X 'POST' 'http://localhost:8000/chat' -H 'Content-Type: application/json' -d '{"user_input": "Hello, AI!"}'
```

---

# **📂 Project Structure**
This API is organized into modular files for **clarity and maintainability**:

| **File/Directory**         | **Description** |
|---------------------------|----------------|
| `api/main.py`             | **FastAPI entry point**, handles API requests. |
| `api/genai_controller.py` | **Non-memory-based LLM controller** (Not in use, provided for reference). |
| `api/genai_streaming_controller.py` | **Active controller for streaming, memory, and function tools.** |
| `requirements.txt`        | Dependencies required to run the API. |
| `test/test_api.py`        | API tests for functionality validation. |
| `docs/STREAMING.md`       | Documentation for **real-time streaming AI responses**. |
| `docs/MEMORY.md`          | Documentation for **LangGraph memory management**. |
| `docs/TOOLS.md`           | Documentation for **function calling and tool execution**. |

---

# **🔧 Development & Deployment**

## **4️⃣ Running FastAPI with Auto-Reload (Development)**
```bash
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

## **5️⃣ Running on a Remote Server**
To allow access from external devices, start the server with:
```bash
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```
Then access it at:
```
http://YOUR_SERVER_IP:8000/docs
```

Ensure **port 8000 is open** in your firewall settings.

---

# **🛠️ Troubleshooting**

## **Common Issues & Fixes**
### ❌ **Virtual Environment Not Activating**
✅ Solution:
```bash
source .venv/Scripts/activate  # Windows (Bash)
source .venv/bin/activate      # Mac/Linux
```

### ❌ **FastAPI Not Starting (`uvicorn` Not Found)**
✅ Solution:
```bash
pip install uvicorn
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

### ❌ **Port Already in Use (`Address already in use`)**
✅ Solution: Try a different port:
```bash
python -m uvicorn api.main:app --host 0.0.0.0 --port 8080 --reload
```

### ❌ **Not Receiving API Responses**
✅ Solution:  
- Make sure FastAPI is running (`python -m uvicorn ...`).
- If using a **remote server**, ensure **port 8000 is open**.
- If running inside Docker or WSL, use `--host 0.0.0.0`.

---

# **🎯 Final Notes**
This API is designed for **scalability, modularity, and performance**. It provides a **pre-built foundation for AI-based applications** while allowing for easy expansion.

📌 **For further improvements, see:**
- [Streaming Responses](./docs/STREAMING.md)
- [Memory & Conversation History](./docs/MEMORY.md)
- [Function Calling (Tool Execution)](./docs/TOOLS.md)

🚀 Happy coding!