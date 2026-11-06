const { execSync } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

// 1. Read .env in memory
const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/^JWT_SECRET=(.+)$/m);
if (!match) {
    console.error("FAIL: JWT_SECRET not found in .env");
    process.exit(1);
}
const envSecret = match[1].trim();
const envFingerprint = crypto.createHash('sha256').update(envSecret).digest('hex').substring(0, 12);
console.log(`Active .env JWT_SECRET non-reversible fingerprint: ${envFingerprint}`);

// 2. Check each running backend container
const containers = ['api-gateway', 'auth-service', 'revenue', 'user-management'];
let allMatched = true;

for (const c of containers) {
    try {
        // Run printf %s "$JWT_SECRET" | sha256sum inside container so secret is NEVER printed or leaked
        // Windows CMD needs single quotes properly handled or escaped
        const stdout = execSync(`docker exec ${c} sh -c "printf %s \\"$JWT_SECRET\\" | sha256sum"`, { encoding: 'utf8' }).trim();
        const containerFullHash = stdout.split(/\s+/)[0];
        const containerFingerprint = containerFullHash.substring(0, 12);
        const isMatch = (containerFingerprint === envFingerprint);
        if (!isMatch) allMatched = false;
        console.log(`Container ${c.padEnd(16)}: ${isMatch ? 'MATCH' : 'MISMATCH'} (Fingerprint: ${containerFingerprint})`);
    } catch (e) {
        allMatched = false;
        console.log(`Container ${c.padEnd(16)}: ERROR (${e.message.trim()})`);
    }
}

console.log(`\nConfiguration Equality Result: ${allMatched ? 'ALL CONTAINERS MATCH ACTIVE .env SECRET' : 'MISMATCH DETECTED'}`);
