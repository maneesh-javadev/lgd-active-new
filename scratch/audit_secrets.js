const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Read .env if present
let envSecret = null;
if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/^JWT_SECRET=(.+)$/m);
    if (match) {
        envSecret = match[1].trim();
    }
}

const legacySecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

function hashFingerprint(str) {
    if (!str) return 'N/A';
    return crypto.createHash('sha256').update(str).digest('hex').substring(0, 12);
}

console.log('Legacy Secret Fingerprint (SHA256 first 12):', hashFingerprint(legacySecret));
console.log('Active Secret Fingerprint (SHA256 first 12):', hashFingerprint(envSecret));

// Find all occurrences across all files
const rootDir = process.cwd();
const filesWithLegacySecret = [];
const filesWithActiveSecret = [];
const filesWithJwtTokens = [];

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(rootDir, fullPath);
        if (entry.isDirectory()) {
            if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'target' || entry.name === 'dist' || entry.name === '.agents') {
                continue;
            }
            walk(fullPath);
        } else if (entry.isFile()) {
            // Ignore binary files and git files
            if (relPath.endsWith('.xlsx') || relPath.endsWith('.p12') || relPath.endsWith('.doc') || relPath.endsWith('.class') || relPath.endsWith('.jar') || relPath.endsWith('.png') || relPath.endsWith('.jpg')) {
                continue;
            }
            // Ignore .env itself when looking for active secret leaks
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(legacySecret)) {
                filesWithLegacySecret.push(relPath);
            }
            if (envSecret && relPath !== '.env' && content.includes(envSecret)) {
                filesWithActiveSecret.push(relPath);
            }
            if (/eyJhbGciOi[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(content)) {
                filesWithJwtTokens.push(relPath);
            }
        }
    }
}

walk(rootDir);

console.log('\n--- Files containing legacy compromised secret ---');
console.log(filesWithLegacySecret);

console.log('\n--- Files containing active .env secret ---');
console.log(filesWithActiveSecret);

console.log('\n--- Files containing raw JWT tokens (eyJhbGciOi...) ---');
console.log(filesWithJwtTokens);
