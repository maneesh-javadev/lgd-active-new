const fs = require('fs');
const crypto = require('crypto');

const content = fs.readFileSync('PHASE0_4_FINAL_SHA256_RECONCILIATION.md', 'utf8');
const lines = content.split('\n');

let checked = 0;
let errors = 0;

for (const line of lines) {
  const parts = line.split('|').map(s => s.trim());
  if (parts.length >= 7 && parts[6] === '**CONFIRMED MATCH**') {
    const desc = parts[1];
    const pathMatch = parts[2].match(/\[`([^`]+)`\]/);
    if (!pathMatch) continue;
    const filePath = pathMatch[1];
    const declaredBytesStr = parts[3].replace(/ bytes$/, '').replace(/,/g, '');
    const declaredBytes = parseInt(declaredBytesStr, 10);
    const declaredHash = parts[5].replace(/`/g, '');

    checked++;
    if (!fs.existsSync(filePath)) {
      console.log('FAIL: Missing file:', filePath);
      errors++;
      continue;
    }
    const buf = fs.readFileSync(filePath);
    const actualHash = crypto.createHash('sha256').update(buf).digest('hex');
    const actualBytes = buf.length;
    if (actualBytes !== declaredBytes) {
      console.log('FAIL: Byte mismatch for', filePath, 'Declared:', declaredBytes, 'Actual:', actualBytes);
      errors++;
    }
    if (actualHash !== declaredHash) {
      console.log('FAIL: Hash mismatch for', filePath, 'Declared:', declaredHash, 'Actual:', actualHash);
      errors++;
    }
  }
}

console.log('Total artifacts checked in PHASE0_4_FINAL_SHA256_RECONCILIATION.md:', checked);
console.log('Total mismatches / errors:', errors);
if (errors === 0) console.log('100% CRYPTOGRAPHIC ATTESTATION CONFIRMED!');
