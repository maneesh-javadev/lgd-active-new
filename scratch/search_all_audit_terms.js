const fs = require('fs');
const path = require('path');

const terms = [
  '15 Confirmed',
  '15 CONFIRMED',
  '6 Partially Confirmed',
  '6 PARTIALLY CONFIRMED',
  'SQLi, XXE',
  'XXE refutation',
  'Eureka service discovery endpoint',
  'CANON-47',
  'VULN-017 / VULN-003',
  'THR-STRIDE-006',
  'VULN-004',
  'VULN-016',
  '21 of 21 VERIFIED_FIXED',
  '21/21 VERIFIED_FIXED',
  'SAST-016',
  'SAST-021',
  'RR-04',
  'RR-05',
  'RR-07',
  'EV-007',
  'EV-007A'
];

const files = fs.readdirSync('.').filter(f => f.endsWith('.md'));

for (const term of terms) {
  console.log(`\n================== TERM: "${term}" ==================`);
  for (const f of files) {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((l, i) => {
      if (l.includes(term)) {
        console.log(`${f}:${i+1}: ${l.trim()}`);
      }
    });
  }
}
