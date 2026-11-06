const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.md'));

const searchPatterns = [
  '15 Confirmed',
  '6 Partially Confirmed',
  'SQLi, XXE',
  'XXE refutation',
  'Eureka service discovery endpoint',
  'CANON-47',
  'VULN-017 / VULN-003',
  'THR-STRIDE-006',
  'VULN-004',
  '21 of 21 VERIFIED_FIXED',
  '21/21 VERIFIED_FIXED',
  '21 of 21',
  'EV-007',
  'RR-04',
  'RR-05',
  'RR-07'
];

console.log('=== SEARCH RESULTS ===');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    for (const pat of searchPatterns) {
      if (line.toLowerCase().includes(pat.toLowerCase())) {
        console.log(`[${file}:${idx + 1}] (${pat}): ${line.trim()}`);
      }
    }
  });
}
