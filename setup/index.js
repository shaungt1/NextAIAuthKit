const loadModels = require('./loadModels');

async function main() {
    console.log('🔧 Running NextAIAuthKit Setup...');
    await loadModels();
    console.log('🎉 Setup Complete.');
}

main().catch(error => {
    console.error('❌ Setup Failed:', error);
    process.exit(1);
});