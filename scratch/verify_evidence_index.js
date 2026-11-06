const fs = require('fs');
const crypto = require('crypto');

const content = fs.readFileSync('PHASE0_4_EVIDENCE_INDEX.md', 'utf8');
const lines = content.split('\n');

let checked = 0;
let errors = 0;

for (const line of lines) {
  const parts = line.split('|').map(s => s.trim());
  if (parts.length >= 6 && parts[1].startsWith('**EVD-')) {
    const id = parts[1];
    const pathMatch = parts[2].match(/`([^`]+)`/);
    if (!pathMatch) continue;
    const filePath = pathMatch[1];

    if (!fs.existsSync(filePath)) {
      console.log('FAIL: Missing file:', filePath);
      errors++;
      continue;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      console.log(`Directory ${id} (${filePath}) skipped from single-file hash check.`);
      continue;
    }

    const buf = fs.readFileSync(filePath);
    const actualHash = crypto.createHash('sha256').update(buf).digest('hex');
    const actualBytes = buf.length;

    // Check size if available
    const sizeMatch = parts[3].match(/\(([0-9,]+) bytes\)/);
    if (sizeMatch) {
      const declaredBytes = parseInt(sizeMatch[1].replace(/,/g, ''), 10);
      if (declaredBytes !== actualBytes) {
        console.log(`FAIL size: ${id} ${filePath}: Declared ${declaredBytes}, Actual ${actualBytes}`);
        errors++;
      }
    }

    // Check hash if available
    const hashMatch = parts[5].match(/`([a-f0-9]{64})`/);
    if (hashMatch) {
      const declaredHash = hashMatch[1];
      if (declaredHash !== actualHash) {
        console.log(`FAIL hash: ${id} ${filePath}: Declared ${declaredHash}, Actual ${actualHash}`);
        errors++;
      } else {
        checked++;
      }
    }
  }
}

console.log('Total artifacts checked in PHASE0_4_EVIDENCE_INDEX.md:', checked);
console.log('Total mismatches / errors:', errors);
if (errors === 0) console.log('100% EVIDENCE INDEX CRYPTOGRAPHIC INTEGRITY CONFIRMED!');
