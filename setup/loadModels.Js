const { PrismaClient } = require('@prisma/client');
const {
    models,
    audioModels,
    fineTuningModels,
    assistantsAPI,
    transcriptionSpeechModels,
    imageGenerationModels,
    embeddingsModels
} = require('../src/data/llm-models/models');

const prisma = new PrismaClient();

async function loadModels() {
    console.log('🚀 Starting Model Load into Prisma Database...');

    const allModelSets = [
        { category: 'Chat', data: models },
        { category: 'Audio', data: audioModels },
        { category: 'Fine-Tuning', data: fineTuningModels },
        { category: 'Assistants', data: assistantsAPI },
        { category: 'Transcription Speech', data: transcriptionSpeechModels },
        { category: 'Image Generation', data: imageGenerationModels },
        { category: 'Embeddings', data: embeddingsModels },
    ];

    for (const { category, data } of allModelSets) {
        console.log(`📌 Processing ${category}...`);

        for (const model of data) {
            try {
                const providerData = model.aiProvider || {
                    category: 'Other',
                    provider: 'Unknown',
                    modelType: 'LLM'
                };

                // ✅ FIXED: Correct AIProvider lookup
                let aiProvider = await prisma.aIProvider.findFirst({
                    where: {
                        category: providerData.category,
                        provider: providerData.provider
                    }
                });

                // ✅ Ensure AIProvider exists
                if (!aiProvider) {
                    aiProvider = await prisma.aIProvider.create({
                        data: {
                            category: providerData.category,
                            provider: providerData.provider,
                            modelType: providerData.modelType
                        }
                    });
                    console.log(`✅ Created AIProvider: ${providerData.category} - ${providerData.provider}`);
                }

                // ✅ FIXED: Model lookup
                const existingModel = await prisma.model.findUnique({
                    where: { name: model.name }
                });

                if (!existingModel) {
                    await prisma.model.create({
                        data: {
                            name: model.name,
                            description: model.description || null,
                            type: model.type || category,
                            inputCost: model.inputCost || null,
                            cachedInputCost: model.cachedInputCost || null,
                            outputCost: model.outputCost || null,
                            totalCost: model.totalCost || null,
                            providerId: aiProvider.id  // ✅ Associate with AIProvider
                        }
                    });
                    console.log(`✅ Added: ${model.name}`);
                } else {
                    console.log(`⚠️ Skipping (Already Exists): ${model.name}`);
                }
            } catch (error) {
                console.error(`❌ Error inserting ${model.name}:`, error);
            }
        }
    }

    await prisma.$disconnect();
    console.log('✅ Model Load Complete.');
}

// Run the script if executed directly
if (require.main === module) {
    loadModels();
}
