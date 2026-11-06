const fs = require('fs');
const path = require('path');

const mdFiles = fs.readdirSync('.').filter(f => f.endsWith('.md'));

console.log('=== SEARCH 1: "Every test row maps directly" ===');
for (const f of mdFiles) {
  const content = fs.readFileSync(f, 'utf8');
  if (/every test row maps directly/i.test(content)) {
    console.log(`Found in: ${f}`);
  }
}

console.log('\n=== SEARCH 2: "THR-STRIDE-009" with VULN-014 or SAST-014 ===');
for (const f of mdFiles) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('THR-STRIDE-009') && (l.includes('VULN-014') || l.includes('SAST-014'))) {
      console.log(`${f}:${idx+1}: ${l.trim()}`);
    }
  });
}

console.log('\n=== SEARCH 3: "THR-STRIDE-011" with VULN-013 ===');
for (const f of mdFiles) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('THR-STRIDE-011') && l.includes('VULN-013')) {
      console.log(`${f}:${idx+1}: ${l.trim()}`);
    }
  });
}

console.log('\n=== SEARCH 4: "THR-STRIDE-014" with VULN-022 ===');
for (const f of mdFiles) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('THR-STRIDE-014') && l.includes('VULN-022')) {
      console.log(`${f}:${idx+1}: ${l.trim()}`);
    }
  });
}

console.log('\n=== SEARCH 5: "THR-STRIDE-020" with VULN-022 ===');
for (const f of mdFiles) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('THR-STRIDE-020') && l.includes('VULN-022')) {
      console.log(`${f}:${idx+1}: ${l.trim()}`);
    }
  });
}

console.log('\n=== SEARCH 6: "CANON-47" and "48 distinct tested targets" in PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md ===');
const p3 = fs.readFileSync('PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md', 'utf8');
console.log('Includes CANON-47:', p3.includes('CANON-47'));
console.log('Includes 48 distinct tested targets:', p3.includes('48 distinct tested targets'));
