/**
 * This file contains the definitions and data for various AI models used in the application.
 * 
 * Sections:
 * 
 * 1. LLM Models:
 *    - Large Language Models including GPT-4, GPT-3.5, and other LLMs.
 *    - These models are used for natural language processing tasks such as text generation, conversation, and more.
 *    - Each model has properties like id, name, description, strengths, type, inputCost, cachedInputCost, outputCost, and totalCost.
 * 
 * 2. Audio Models:
 *    - Models specialized in audio processing such as speech-to-text and text-to-speech.
 *    - These models are used for converting speech to text and vice versa.
 *    - Each model has properties like id, name, description, type, inputCost, cachedInputCost, outputCost, and totalCost.
 * 
 * 3. Fine-Tuning Models:
 *    - Models that have been fine-tuned for specific tasks.
 *    - These models are optimized for particular use cases to enhance performance.
 *    - Each model has properties like id, name, description, trainingCost, inputCost, cachedInputCost, outputCost, and totalCost.
 * 
 * 4. Assistants API:
 *    - Models providing specific assistant functionalities like code interpretation and file search.
 *    - These models are used for specialized tasks to assist users in various activities.
 *    - Each model has properties like id, name, description, and cost.
 * 
 * 5. Transcription Speech Models:
 *    - Models focused on transcription and speech generation.
 *    - These models are used for converting speech to text and generating speech from text.
 *    - Each model has properties like id, name, description, useCase, and cost.
 * 
 * 6. Image Generation Models:
 *    - Models for generating images from text descriptions.
 *    - These models are used for creating visual content based on textual input.
 *    - Each model has properties like id, name, description, quality, and cost.
 * 
 * 7. Embeddings Models:
 *    - Models for generating embeddings for text data.
 *    - These models are used for transforming text into numerical representations for various AI tasks.
 *    - Each model has properties like id, name, description, and cost.
 */

export const types = ['GPT-4', 'GPT-3.5', 'Other LLMs', 'Speech-to-Text', 'Text-to-Speech'] as const;

export type ModelType = (typeof types)[number];

export interface Model<Type = string> {
    id: string;
    name: string;
    description: string;
    strengths?: string;
    type: Type;
    inputCost?: number | null;  // Cost per 1M input tokens
    cachedInputCost?: number | null; // Cached Input per 1M tokens
    outputCost?: number | null; // Cost per 1M output tokens
    totalCost?: number | null;  // General cost field, defaults to null for all models
}

export const models: Model<ModelType>[] = [
    // 🟢 Latest GPT-4 LLM Models
    {
        id: 'gpt-4o-2024-08-06',
        name: 'GPT-4o',
        description: 'OpenAI’s most advanced model with state-of-the-art reasoning, multimodal capabilities, and high efficiency.',
        strengths: 'Best for complex problem-solving, multi-turn conversations, and creative writing.',
        type: 'GPT-4',
        inputCost: 2.50,
        cachedInputCost: 1.25,
        outputCost: 10.00,
        totalCost: null
    },
    {
        id: 'gpt-4o-audio-preview-2024-12-17',
        name: 'GPT-4o Audio Preview',
        description: 'Audio-enabled version of GPT-4o, optimized for speech recognition and synthesis.',
        strengths: 'Ideal for voice assistants and AI-driven conversations with audio input/output.',
        type: 'GPT-4',
        inputCost: 2.50,
        cachedInputCost: null,
        outputCost: 10.00,
        totalCost: null
    },
    {
        id: 'gpt-4o-realtime-preview-2024-12-17',
        name: 'GPT-4o Realtime Preview',
        description: 'A faster version of GPT-4o designed for real-time interactions.',
        strengths: 'Optimized for conversational AI and dynamic user interactions.',
        type: 'GPT-4',
        inputCost: 5.00,
        cachedInputCost: 2.50,
        outputCost: 20.00,
        totalCost: null
    },
    {
        id: 'gpt-4o-mini-2024-07-18',
        name: 'GPT-4o Mini',
        description: 'A lightweight, cost-effective version of GPT-4o for efficiency-focused applications.',
        strengths: 'Balances cost and performance, great for AI chatbots and customer support.',
        type: 'GPT-4',
        inputCost: 0.15,
        cachedInputCost: 0.075,
        outputCost: 0.60,
        totalCost: null
    },
    {
        id: 'gpt-4o-mini-audio-preview-2024-12-17',
        name: 'GPT-4o Mini Audio Preview',
        description: 'Smaller, more efficient audio-processing model for GPT-4o Mini.',
        strengths: 'Designed for voice-based applications requiring minimal compute resources.',
        type: 'GPT-4',
        inputCost: 0.15,
        cachedInputCost: null,
        outputCost: 0.60,
        totalCost: null
    },
    {
        id: 'gpt-4o-mini-realtime-preview-2024-12-17',
        name: 'GPT-4o Mini Realtime Preview',
        description: 'A faster version of GPT-4o Mini optimized for real-time responses.',
        strengths: 'Best suited for AI-driven real-time applications.',
        type: 'GPT-4',
        inputCost: 0.60,
        cachedInputCost: 0.30,
        outputCost: 2.40,
        totalCost: null
    },
    {
        id: 'o1-2024-12-17',
        name: 'O1',
        description: 'A high-performance AI model focused on structured reasoning and efficiency.',
        strengths: 'Best for enterprise-grade AI applications and structured document generation.',
        type: 'Other LLMs',
        inputCost: 15.00,
        cachedInputCost: 7.50,
        outputCost: 60.00,
        totalCost: null
    },
    {
        id: 'o3-mini-2025-01-31',
        name: 'O3 Mini',
        description: 'A scaled-down version of the O1 model, balancing cost and accuracy.',
        strengths: 'Suitable for budget-conscious AI applications.',
        type: 'Other LLMs',
        inputCost: 1.10,
        cachedInputCost: 0.55,
        outputCost: 4.40,
        totalCost: null
    },
    {
        id: 'o1-mini-2024-09-12',
        name: 'O1 Mini',
        description: 'An entry-level model in the O-series, providing cost-efficient results.',
        strengths: 'Good for general-purpose AI applications with moderate compute requirements.',
        type: 'Other LLMs',
        inputCost: 1.10,
        cachedInputCost: 0.55,
        outputCost: 4.40,
        totalCost: null
    },

    // 🟢 Other Leading LLM Models
    {
        id: 'chatgpt-4o-latest',
        name: 'ChatGPT-4o Latest',
        description: 'ChatGPT-4o model optimized for conversational AI.',
        strengths: 'Best for dynamic chat applications and AI-driven customer support.',
        type: 'GPT-4',
        inputCost: 5.00,
        cachedInputCost: null,
        outputCost: 15.00,
        totalCost: null
    },
    {
        id: 'gpt-4-turbo-2024-04-09',
        name: 'GPT-4 Turbo',
        description: 'An improved version of GPT-4 optimized for cost efficiency and speed.',
        strengths: 'Great for high-volume AI applications requiring fast response times.',
        type: 'GPT-4',
        inputCost: 10.00,
        cachedInputCost: null,
        outputCost: 30.00,
        totalCost: null
    },
    {
        id: 'gpt-4-0613',
        name: 'GPT-4 (Legacy)',
        description: 'A legacy version of GPT-4, known for its stability in enterprise use cases.',
        strengths: 'Best for structured document generation and enterprise AI applications.',
        type: 'GPT-4',
        inputCost: 30.00,
        cachedInputCost: null,
        outputCost: 60.00,
        totalCost: null
    },
    {
        id: 'gpt-4-32k',
        name: 'GPT-4 32K',
        description: 'An extended context version of GPT-4, allowing for longer inputs and document processing.',
        strengths: 'Best for summarization, research, and legal document processing.',
        type: 'GPT-4',
        inputCost: 60.00,
        cachedInputCost: null,
        outputCost: 120.00,
        totalCost: null
    },
    {
        id: 'gpt-3.5-turbo-0125',
        name: 'GPT-3.5 Turbo',
        description: 'A cost-effective and efficient alternative to GPT-4 models.',
        strengths: 'Good for budget-friendly AI applications while maintaining high-quality responses.',
        type: 'GPT-3.5',
        inputCost: 0.50,
        cachedInputCost: null,
        outputCost: 1.50,
        totalCost: null
    },
    {
        id: 'gpt-3.5-turbo-instruct',
        name: 'GPT-3.5 Turbo Instruct',
        description: 'Optimized for structured instruction-following applications.',
        strengths: 'Great for AI-driven educational content and instructional guides.',
        type: 'GPT-3.5',
        inputCost: 1.50,
        cachedInputCost: null,
        outputCost: 2.00,
        totalCost: null
    },
    {
        id: 'gpt-3.5-turbo-16k-0613',
        name: 'GPT-3.5 Turbo 16K',
        description: 'Extended context version of GPT-3.5, useful for summarization and analysis.',
        strengths: 'Handles longer documents, better for summarization and research papers.',
        type: 'GPT-3.5',
        inputCost: 3.00,
        cachedInputCost: null,
        outputCost: 4.00,
        totalCost: null
    },
    {
        id: 'davinci-002',
        name: 'Davinci-002',
        description: 'A high-end AI model for advanced reasoning and text analysis.',
        strengths: 'Best for AI-driven structured data analysis.',
        type: 'Other LLMs',
        inputCost: 2.00,
        cachedInputCost: null,
        outputCost: 2.00,
        totalCost: null
    },
    {
        id: 'babbage-002',
        name: 'Babbage-002',
        description: 'A lightweight AI model for basic NLP tasks.',
        strengths: 'Good for simple text classification and extraction.',
        type: 'Other LLMs',
        inputCost: 0.40,
        cachedInputCost: null,
        outputCost: 0.40,
        totalCost: null
    }
];

export const audioTypes = ['Speech-to-Text', 'Text-to-Speech'] as const;

export type AudioModelType = (typeof audioTypes)[number];

export interface AudioModel<Type = string> {
    id: string;
    name: string;
    description: string;
    type: Type;
    inputCost?: number | null;
    cachedInputCost?: number | null;
    outputCost?: number | null;
    totalCost?: number | null;
}

export const audioModels: AudioModel<AudioModelType>[] = [
    {
        id: 'gpt-4o-audio-preview-2024-12-17',
        name: 'GPT-4o Audio Preview',
        description: 'Enhanced audio processing capabilities for speech-to-text and text-to-speech applications.',
        type: 'Speech-to-Text',
        inputCost: 40.00,
        cachedInputCost: null,
        outputCost: 80.00,
        totalCost: null
    },
    {
        id: 'gpt-4o-mini-audio-preview-2024-12-17',
        name: 'GPT-4o Mini Audio Preview',
        description: 'Lighter version of GPT-4o for faster, cost-effective audio-based applications.',
        type: 'Speech-to-Text',
        inputCost: 10.00,
        cachedInputCost: null,
        outputCost: 20.00,
        totalCost: null
    },
    {
        id: 'gpt-4o-realtime-preview-2024-12-17',
        name: 'GPT-4o Realtime Preview',
        description: 'Real-time speech processing with ultra-low latency for live applications.',
        type: 'Speech-to-Text',
        inputCost: 40.00,
        cachedInputCost: 2.50,
        outputCost: 80.00,
        totalCost: null
    },
    {
        id: 'gpt-4o-mini-realtime-preview-2024-12-17',
        name: 'GPT-4o Mini Realtime Preview',
        description: 'Compact model optimized for real-time, low-latency speech applications.',
        type: 'Speech-to-Text',
        inputCost: 10.00,
        cachedInputCost: 0.30,
        outputCost: 20.00,
        totalCost: null
    }
];

export interface FineTuningModel {
    id: string;
    name: string;
    description: string;
    trainingCost: number;
    inputCost: number | null;
    cachedInputCost: number | null;
    outputCost: number | null;
    totalCost?: number | null;
}

export const fineTuningModels: FineTuningModel[] = [
    {
        id: 'gpt-4o-2024-08-06',
        name: 'GPT-4o',
        description: 'Fine-tuned GPT-4o model for enhanced task-specific performance.',
        trainingCost: 25.00,
        inputCost: 3.75,
        cachedInputCost: 1.875,
        outputCost: 15.00,
        totalCost: null
    },
    {
        id: 'gpt-4o-mini-2024-07-18',
        name: 'GPT-4o Mini',
        description: 'Lighter fine-tuned version of GPT-4o for cost-efficient AI solutions.',
        trainingCost: 3.00,
        inputCost: 0.30,
        cachedInputCost: 0.15,
        outputCost: 1.20,
        totalCost: null
    },
    {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fine-tuned GPT-3.5 model optimized for performance vs. cost balance.',
        trainingCost: 8.00,
        inputCost: 3.00,
        cachedInputCost: null,
        outputCost: 6.00,
        totalCost: null
    },
    {
        id: 'davinci-002',
        name: 'Davinci-002',
        description: 'Advanced fine-tuned Davinci model for reasoning and structured outputs.',
        trainingCost: 6.00,
        inputCost: 12.00,
        cachedInputCost: null,
        outputCost: 12.00,
        totalCost: null
    },
    {
        id: 'babbage-002',
        name: 'Babbage-002',
        description: 'Basic fine-tuned Babbage model for lightweight AI tasks.',
        trainingCost: 0.40,
        inputCost: 1.60,
        cachedInputCost: null,
        outputCost: 1.60,
        totalCost: null
    }
];


export interface AssistantsAPI {
    id: string;
    name: string;
    description: string;
    cost: number;
}

export const assistantsAPI: AssistantsAPI[] = [
    {
        id: 'code-interpreter',
        name: 'Code Interpreter',
        description: 'Runs and executes code in real-time, useful for AI-powered programming assistance.',
        cost: 0.03
    },
    {
        id: 'file-search',
        name: 'File Search',
        description: 'AI-assisted file search system with cost per GB of data processed.',
        cost: 0.10
    }
];


export interface TranscriptionSpeechModel {
    id: string;
    name: string;
    description: string;
    useCase: string;
    cost: number;
}

export const transcriptionSpeechModels: TranscriptionSpeechModel[] = [
    {
        id: 'whisper',
        name: 'Whisper',
        description: 'Automatic speech recognition (ASR) model for transcription.',
        useCase: 'Transcription',
        cost: 0.006
    },
    {
        id: 'tts',
        name: 'TTS',
        description: 'Text-to-Speech model that converts text into natural speech.',
        useCase: 'Speech Generation',
        cost: 15.00
    },
    {
        id: 'tts-hd',
        name: 'TTS HD',
        description: 'High-definition text-to-speech generation with superior quality.',
        useCase: 'Speech Generation',
        cost: 30.00
    }
];


export interface ImageGenerationModel {
    id: string;
    name: string;
    description: string;
    quality: string;
    cost: number;
}

export const imageGenerationModels: ImageGenerationModel[] = [
    {
        id: 'dalle-3-standard',
        name: 'DALL·E 3 (Standard)',
        description: 'AI image generation model producing high-quality creative visuals.',
        quality: '1024x1024',
        cost: 0.04
    },
    {
        id: 'dalle-3-hd',
        name: 'DALL·E 3 (HD)',
        description: 'High-definition AI-generated images with greater detail and resolution.',
        quality: '1024x1792',
        cost: 0.08
    },
    {
        id: 'dalle-2-256',
        name: 'DALL·E 2 (256x256)',
        description: 'Lower resolution AI-generated images with cost-effective pricing.',
        quality: '256x256',
        cost: 0.016
    },
    {
        id: 'dalle-2-512',
        name: 'DALL·E 2 (512x512)',
        description: 'Medium resolution AI-generated images with a balance of cost and quality.',
        quality: '512x512',
        cost: 0.018
    },
    {
        id: 'dalle-2-1024',
        name: 'DALL·E 2 (1024x1024)',
        description: 'High-quality AI-generated images for creative and commercial applications.',
        quality: '1024x1024',
        cost: 0.02
    }
];


export interface EmbeddingsModel {
    id: string;
    name: string;
    description: string;
    cost: number;
}

export const embeddingsModels: EmbeddingsModel[] = [
    {
        id: 'text-embedding-3-small',
        name: 'Text Embedding 3 Small',
        description: 'Optimized for lightweight embedding tasks with minimal compute requirements.',
        cost: 0.02
    },
    {
        id: 'text-embedding-3-large',
        name: 'Text Embedding 3 Large',
        description: 'High-performance embeddings for deep AI models.',
        cost: 0.13
    },
    {
        id: 'text-embedding-ada-002',
        name: 'Text Embedding Ada-002',
        description: 'Well-balanced embeddings model for most AI applications.',
        cost: 0.10
    }
];
