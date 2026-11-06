const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const dir = 'SECURITY_AUDIT_CONTROLLER';
const reportPath = path.join(dir, 'PHASE_8_1_EVIDENCE_INTEGRITY_REPORT.md');
const lines = fs.readFileSync(reportPath, 'utf8').split(/\r?\n/);
const tableRows = lines.filter(l => l.startsWith('| **MASTER_') || l.startsWith('| **PHASE_'));

console.log('Total table rows in report:', tableRows.length);
let mismatchCount = 0;
for (const r of tableRows) {
  const parts = r.split('|').map(s => s.trim()).filter(Boolean);
  const name = parts[0].replace(/\*\*/g, '');
  const hash = parts[3].replace(/`/g, '');
  const actualHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, name))).digest('hex').toUpperCase();
  if (hash !== actualHash) {
    console.log('MISMATCH:', name, 'Expected:', hash, 'Actual:', actualHash);
    mismatchCount++;
  }
}
console.log('Total mismatches:', mismatchCount);

