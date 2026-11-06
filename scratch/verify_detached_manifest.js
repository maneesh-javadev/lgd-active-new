const fs = require('fs');
const crypto = require('crypto');

const manifestLines = fs.readFileSync('PHASE0_4_FINAL_DELIVERABLE_SHA256_MANIFEST.md', 'utf8').split('\n');

let count = 0;
let errors = 0;

for (const line of manifestLines) {
  if (line.startsWith('|') && line.includes('bytes')) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 7) {
      const num = parts[1];
      const linkText = parts[3].split('](')[0].replace(/[\[`\]]/g, '').trim();
      const declaredBytes = parseInt(parts[4].replace(/,/g, '').match(/\d+/)[0], 10);
      const declaredHash = parts[6].replace(/`/g, '').trim();

      count++;
      const buf = fs.readFileSync(linkText);
      const actualBytes = buf.length;
      const actualHash = crypto.createHash('sha256').update(buf).digest('hex');

      const bytesOk = actualBytes === declaredBytes;
      const hashOk = actualHash === declaredHash;

      if (bytesOk && hashOk) {
        console.log('[MATCH] ' + num + '. ' + linkText + ' (' + actualBytes.toLocaleString() + ' bytes) -> ' + actualHash);
      } else {
        console.log('[MISMATCH] ' + num + '. ' + linkText);
        if (!bytesOk) console.log('   Bytes: declared ' + declaredBytes + ' vs actual ' + actualBytes);
        if (!hashOk) console.log('   Hash:  declared ' + declaredHash + ' vs actual ' + actualHash);
        errors++;
      }
    }
  }
}

console.log('\nVerified ' + count + ' deliverables with ' + errors + ' errors.');
if (errors > 0) process.exit(1);
