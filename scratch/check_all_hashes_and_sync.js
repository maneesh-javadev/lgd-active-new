const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');

// Read PHASE0_4_EVIDENCE_INDEX.md
const evidenceContent = fs.readFileSync(path.join(rootDir, 'PHASE0_4_EVIDENCE_INDEX.md'), 'utf8');

// Parse all rows from tables in PHASE0_4_EVIDENCE_INDEX.md
// Format: | **ID** | `File Path` | Format / Exact Size | Description | **SHA-256:** `hash` |
const lines = evidenceContent.split('\n');
const evidenceItems = [];
lines.forEach(l => {
  const match = l.match(/\|\s*\*\*([^*]+)\*\*\s*\|\s*`([^`]+)`\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(?:\*\*SHA-256:\*\*\s*`([a-f0-9]{64})`|([^|]+))\s*\|/i);
  if (match) {
    evidenceItems.push({
      id: match[1].trim(),
      filePath: match[2].trim(),
      declaredSizeStr: match[3].trim(),
      declaredHash: match[5] ? match[5].trim() : null,
      verificationMechanism: match[6] ? match[6].trim() : null,
      line: l
    });
  }
});

console.log(`Found ${evidenceItems.length} indexed items in PHASE0_4_EVIDENCE_INDEX.md\n`);

let diffCount = 0;
evidenceItems.forEach(item => {
  const fullPath = path.join(rootDir, item.filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[MISSING] ${item.id} -> ${item.filePath}`);
    diffCount++;
    return;
  }
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    console.log(`[DIR] ${item.id} -> ${item.filePath}`);
    return;
  }
  const buf = fs.readFileSync(fullPath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  const size = buf.length;
  
  if (item.declaredHash && item.declaredHash !== hash) {
    console.log(`[HASH MISMATCH] ${item.id} (${item.filePath}):`);
    console.log(`   Declared: ${item.declaredHash} (${item.declaredSizeStr})`);
    console.log(`   Actual:   ${hash} (${size.toLocaleString()} bytes)`);
    diffCount++;
  } else if (item.declaredHash) {
    console.log(`[MATCH] ${item.id} (${item.filePath}) - ${size.toLocaleString()} bytes`);
  }
});

console.log(`\nTotal mismatches: ${diffCount}`);
