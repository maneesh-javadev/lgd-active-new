const fs = require('fs');
const path = require('path');

function getMdFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', 'target', 'dist', '.gemini', 'pre_remediation_backup'].includes(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getMdFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getMdFiles('.');

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    // Check DREAD claims
    if (/all\s+20\s+dread.*(?:verified|remediated|closed|fixed)|dread.*(?:verified\s+fixed|remediated\s*\/|closed\s+through)/i.test(l)) {
      console.log(`[DREAD_CLAIM] ${f}:${idx+1}: ${l.trim()}`);
    }
    // Check 12/9
    if (/12\s+(?:vectors\s+)?VERIFIED_FIXED|12\s+VERIFIED_FIXED|9\s+FIXED_PENDING_TEST|9\s+VECTORS\s+FIXED/i.test(l)) {
      console.log(`[12/9] ${f}:${idx+1}: ${l.trim()}`);
    }
  });
}
