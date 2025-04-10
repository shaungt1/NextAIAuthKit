# api/config/ai_services.py

"""
AI services registry for FastAPI.
Returns a dictionary of available AI services, optionally filtered by settings.
Self-contained with zero-config default; togglable via settings.py.
"""

from functools import lru_cache
from api.config.settings import (
    ENABLE_AI_SERVICES,        # Boolean toggle to enable/disable all AI services
    SELECTED_AI_PROVIDER,     # Optional string to filter to a specific provider (e.g., "OpenAI")
    SELECTED_AI_MODEL         # Optional string to filter to a specific model (e.g., "gpt-4o")
)

@lru_cache()
def get_ai_services() -> dict:
    """
    Returns the AI services registry, filtered by settings if specified.
    Cached for minimal latency after first call.

    Returns:
        dict: A dictionary of AI service categories and their providers/models.
              Returns an empty dict if ENABLE_AI_SERVICES is False.

    Notes:
        - If ENABLE_AI_SERVICES is False, returns an empty dictionary.
        - If SELECTED_AI_PROVIDER or SELECTED_AI_MODEL is set in settings.py,
          filters the registry to include only matching providers/models.
        - Uses @lru_cache() to ensure the result is computed once and reused,
          optimizing performance for repeated calls.
    """
    # Check if AI services are enabled; return empty dict if disabled
    if not ENABLE_AI_SERVICES:
        return {}

    # Define the full registry of AI services
    # Structure: {category: {provider: [models]}}
    all_services = {
        "HostedLLMProviders": {  # Externally hosted language models
            "OpenAI": ["gpt-4o", "gpt-3.5-turbo"],
            "Anthropic": ["claude-3-opus", "claude-3-sonnet"],
            "Grok": ["grok-1"],
            "XAI": ["xai-vision-alpha"],
        },
        "SelfHostedModels": {  # Locally hosted language models
            "DeepSeek": ["deepseek-v1", "deepseek-v3", "deepseek-r1", "deepseek-r1-zero"],
            "Mistral": ["mistral-7b", "mixtral-8x7b"],
            "Meta": ["llama-3", "llama-4"],
            "BitNet": ["bitnet-2"]
        },
        "InferenceEngines": {  # Engines for running inference
            "vLLM": ["vllm-server"],
            "llama.cpp": ["llama.cpp-runtime"],
            "LiteLLM": ["proxy"],
            "HF Transformers": ["pipeline", "AutoModel", "AutoTokenizer"]
        },
        "Adapters": {  # Adapters for integrating external services
            "HuggingFace": ["hub_load", "space_infer"]
        },
        "AudioTTSModels": {  # Text-to-speech models
            "Sesame": ["csm-1b"]
        },
        "MultimodalReasoning": {  # Models supporting multiple modalities
            "DeepSeek-R1-Zero": ["code", "chat", "audio"]
        }
    }

    # If no filtering is specified, return the full registry
    if not SELECTED_AI_PROVIDER and not SELECTED_AI_MODEL:
        return all_services

    # Filter the registry based on SELECTED_AI_PROVIDER and/or SELECTED_AI_MODEL
    filtered_services = {}
    for category, providers in all_services.items():
        # Apply filtering only to provider-based categories
        if category in ["HostedLLMProviders", "SelfHostedModels"]:
            filtered_providers = {}
            for provider, models in providers.items():
                # Skip providers not matching SELECTED_AI_PROVIDER if set
                if SELECTED_AI_PROVIDER and provider != SELECTED_AI_PROVIDER:
                    continue
                # Filter models if SELECTED_AI_MODEL is set
                if SELECTED_AI_MODEL:
                    filtered_models = [m for m in models if m == SELECTED_AI_MODEL]
                    if filtered_models:  # Only include provider if it has matching models
                        filtered_providers[provider] = filtered_models
                else:
                    filtered_providers[provider] = models  # Include all models if no model filter
            if filtered_providers:  # Only add category if providers remain
                filtered_services[category] = filtered_providers
        else:
            # Non-provider categories (e.g., InferenceEngines) are included unfiltered
            filtered_services[category] = providers

    return filtered_services