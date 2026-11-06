const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const content = fs.readFileSync('PHASE0_4_EVIDENCE_INDEX.md', 'utf8');
const lines = content.split('\n');

const tableRows = [];
for (const line of lines) {
  if (line.startsWith('| **EVD-')) {
    const parts = line.split('|').map(s => s.trim()).filter(Boolean);
    const evdId = parts[0];
    const filePath = parts[1].replace(/`/g, '');
    const declaredFormat = parts[2];
    const declaredDesc = parts[3];
    const declaredVerif = parts[4];
    tableRows.push({ evdId, filePath, declaredFormat, declaredDesc, declaredVerif });
  }
}

console.log('Total indexed items in PHASE0_4_EVIDENCE_INDEX.md:', tableRows.length);

const results = [];

for (const row of tableRows) {
  if (!fs.existsSync(row.filePath)) {
    results.push({
      id: row.evdId,
      path: row.filePath,
      status: 'MISSING',
      declaredVerif: row.declaredVerif
    });
    continue;
  }
  const stat = fs.statSync(row.filePath);
  if (stat.isDirectory()) {
    results.push({
      id: row.evdId,
      path: row.filePath,
      status: 'DIRECTORY',
      declaredVerif: row.declaredVerif
    });
    continue;
  }
  const raw = fs.readFileSync(row.filePath);
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  const sizeKb = (raw.length / 1024).toFixed(1);
  const match = row.declaredVerif.includes(hash);
  results.push({
    id: row.evdId,
    path: row.filePath,
    bytes: raw.length,
    sizeKb: sizeKb + ' KB',
    hash,
    status: match ? 'MATCH' : 'MISMATCH',
    declaredVerif: row.declaredVerif
  });
}

console.log(JSON.stringify(results, null, 2));
