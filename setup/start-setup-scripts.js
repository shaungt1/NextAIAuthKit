const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const scripts = [
    'setup/loadModels.Js',

];

console.log('🚀 Running Setup Scripts...');

scripts.forEach((script) => {
    try {
        const scriptPath = path.resolve(__dirname, '..', script); // Fix path resolution

        if (!fs.existsSync(scriptPath)) {
            console.warn(`⚠️ Skipping: ${scriptPath} (File not found)`);
            return;
        }

        console.log(`📌 Running: ${scriptPath}`);

        const tsNodeCmd = os.platform() === 'win32' ? 'npx ts-node.cmd' : 'npx ts-node';
        execSync(`${tsNodeCmd} "${scriptPath}"`, { stdio: 'inherit' });

    } catch (error) {
        console.error(`❌ Error executing ${script}:`, error.message);
    }
});

console.log('✅ All Setup Scripts Executed Successfully.');
