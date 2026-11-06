const fs = require('fs');
const crypto = require('crypto');

const manifest = fs.readFileSync('PHASE_6_FINAL_SHA256_MANIFEST.md', 'utf8');
const lines = manifest.split('\n');
let verified = 0;
let errors = 0;

for (const line of lines) {
    const parts = line.split('|').map(s => s.trim());
    if (parts.length >= 6 && /^\d+$/.test(parts[1])) {
        const fileMatch = parts[2].match(/\[`([^`]+)`\]/);
        if (!fileMatch) continue;
        const file = fileMatch[1];
        const statedSize = parseInt(parts[3], 10);
        const statedLines = parseInt(parts[4], 10);
        const hashMatch = parts[5].match(/`([a-f0-9]{64})`/);
        if (!hashMatch) continue;
        const statedHash = hashMatch[1];

        if (!fs.existsSync(file)) {
            console.error('File not found: ' + file);
            errors++;
            continue;
        }

        const buf = fs.readFileSync(file);
        const actualHash = crypto.createHash('sha256').update(buf).digest('hex');
        const actualLines = buf.toString('utf8').split('\n').length;
        const actualSize = buf.length;

        if (actualHash !== statedHash) {
            console.error('Hash mismatch for ' + file + ': expected ' + statedHash + ', got ' + actualHash);
            errors++;
        }
        if (actualSize !== statedSize) {
            console.error('Size mismatch for ' + file + ': expected ' + statedSize + ', got ' + actualSize);
            errors++;
        }
        if (actualLines !== statedLines) {
            console.error('Lines mismatch for ' + file + ': expected ' + statedLines + ', got ' + actualLines);
            errors++;
        }
        verified++;
    }
}

console.log('Total verified in manifest: ' + verified);
console.log('Total errors: ' + errors);

