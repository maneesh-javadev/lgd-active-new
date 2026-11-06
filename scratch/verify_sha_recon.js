const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const reconPath = path.join(rootDir, 'PHASE0_4_FINAL_SHA256_RECONCILIATION.md');
const content = fs.readFileSync(reconPath, 'utf8');

const lines = content.split('\n');
let totalChecked = 0;
let errors = 0;

lines.forEach(l => {
  // Format: | **Description** | [`path`](...) | size bytes | size KB | `hash` | **CONFIRMED MATCH** |
  const match = l.match(/\|\s*\*\*([^*]+)\*\*\s*\|\s*\[`([^`]+)`\]\([^)]+\)\s*\|\s*([0-9,]+)\s*bytes\s*\|\s*[^|]+\|\s*`([a-f0-9]{64})`\s*\|\s*\*\*CONFIRMED MATCH\*\*\s*\|/i);
  if (match) {
    const desc = match[1].trim();
    const filePath = match[2].trim();
    const declaredBytes = parseInt(match[3].replace(/,/g, ''), 10);
    const declaredHash = match[4].trim();
    
    totalChecked++;
    const fullPath = path.join(rootDir, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`[FILE MISSING] ${filePath}`);
      errors++;
      return;
    }
    const buf = fs.readFileSync(fullPath);
    const actualBytes = buf.length;
    const actualHash = crypto.createHash('sha256').update(buf).digest('hex');
    
    if (actualBytes !== declaredBytes) {
      console.log(`[SIZE MISMATCH] ${filePath}: declared ${declaredBytes}, actual ${actualBytes}`);
      errors++;
    }
    if (actualHash !== declaredHash) {
      console.log(`[HASH MISMATCH] ${filePath}: declared ${declaredHash}, actual ${actualHash}`);
      errors++;
    }
  }
});

console.log(`Checked ${totalChecked} items in PHASE0_4_FINAL_SHA256_RECONCILIATION.md. Errors: ${errors}`);
