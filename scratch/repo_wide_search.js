const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.md'));

const queries = [
  { name: '21 / 21 VERIFIED_FIXED', regex: /21\s*\/\s*21\s*VERIFIED_FIXED/i },
  { name: 'ALL 21 FINDINGS VERIFIED_FIXED', regex: /ALL\s*21\s*FINDINGS\s*VERIFIED_FIXED/i },
  { name: 'VULN-008 with THR-STRIDE-002', regex: /THR-STRIDE-002[^\n|]*[|][^\n|]*VULN-008|VULN-008[^\n|]*[|][^\n|]*THR-STRIDE-002/i },
  { name: 'VULN-006 with THR-STRIDE-003', regex: /THR-STRIDE-003[^\n|]*[|][^\n|]*VULN-006|VULN-006[^\n|]*[|][^\n|]*THR-STRIDE-003/i },
  { name: 'VULN-003 with THR-STRIDE-005', regex: /THR-STRIDE-005[^\n|]*[|][^\n|]*VULN-003|VULN-003[^\n|]*[|][^\n|]*THR-STRIDE-005/i },
  { name: 'VULN-009 with THR-STRIDE-007', regex: /THR-STRIDE-007[^\n|]*[|][^\n|]*VULN-009|VULN-009[^\n|]*[|][^\n|]*THR-STRIDE-007/i },
  { name: 'OBS-SQLI-01 as active/exploitable', regex: /OBS-SQLI-01/i },
  { name: 'VULN-010 with master data', regex: /VULN-010[^\n]*(Master Data|Directory Master)/i },
  { name: 'VULN-003 / VULN-004 with tenant-boundary BOLA', regex: /(Tenant Boundary Bypass|BOLA)[^\n]*(VULN-003|VULN-004)|(VULN-003|VULN-004)[^\n]*(Tenant Boundary Bypass|BOLA)/i },
  { name: 'Gate A PASS', regex: /Gate A[:\s*`_]*PASS/i }
];

console.log('=== RUNNING REPO-WIDE SEARCH ===');
for (const file of files) {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const lines = content.split('\n');

  queries.forEach(q => {
    lines.forEach((line, idx) => {
      if (q.regex.test(line)) {
        console.log(`[${file}:L${idx+1}] [${q.name}] => ${line.trim()}`);
      }
    });
  });
}
