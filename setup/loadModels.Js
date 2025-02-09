const { PrismaClient } = require('@prisma/client');
const { models, audioModels, fineTuningModels, assistantsAPI, transcriptionSpeechModels, imageGenerationModels, embeddingsModels } = require('../src/data/llm-models/models');

const prisma = new PrismaClient();

async function loadModels() {
    console.log('🚀 Starting Model Load into Prisma Database...');

    const allModelSets = [
        { category: 'LLMs', data: models },
        { category: 'Audio Models', data: audioModels },
        { category: 'Fine-Tuning Models', data: fineTuningModels },
        { category: 'Assistants API', data: assistantsAPI },
        { category: 'Transcription Speech Models', data: transcriptionSpeechModels },
        { category: 'Image Generation Models', data: imageGenerationModels },
        { category: 'Embeddings Models', data: embeddingsModels },
    ];

    for (const { category, data } of allModelSets) {
        console.log(`📌 Processing ${category}...`);

        for (const model of data) {
            try {
                // Check if the model already exists
                const existingModel = await prisma.model.findUnique({
                    where: { name: model.name }
                });

                if (!existingModel) {
                    await prisma.model.create({
                        data: {
                            name: model.name,
                            description: model.description,
                            type: model.type || category,
                            inputCost: model.inputCost || null,
                            cachedInputCost: model.cachedInputCost || null,
                            outputCost: model.outputCost || null,
                            totalCost: model.totalCost || null
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
