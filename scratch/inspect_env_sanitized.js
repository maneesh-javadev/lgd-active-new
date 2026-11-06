const fs = require('fs');
const crypto = require('crypto');
const lines = fs.readFileSync('.env', 'utf8').split('\n');
lines.forEach((line, idx) => {
    if (line.startsWith('JWT_SECRET=')) {
        const val = line.substring('JWT_SECRET='.length).trim();
        const fp = crypto.createHash('sha256').update(val).digest('hex').substring(0, 12);
        console.log(`Line ${idx + 1}: JWT_SECRET length=${val.length}, fingerprint=${fp}`);
    } else {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
