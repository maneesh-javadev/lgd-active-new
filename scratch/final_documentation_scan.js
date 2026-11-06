const fs = require('fs');
const path = require('path');

const root = process.cwd();
const mdFiles = fs.readdirSync(root).filter(f => f.endsWith('.md'));

console.log(`Starting scan across ${mdFiles.length} root markdown files...`);

const report = {
  totalFiles: mdFiles.length,
  scannedFiles: [],
  discrepancies: []
};

// Required counts
const expectedStride = Array.from({ length: 20 }, (_, i) => `THR-STRIDE-${String(i + 1).padStart(3, '0')}`);
const expectedVuln = Array.from({ length: 23 }, (_, i) => `VULN-${String(i + 1).padStart(3, '0')}`);
const expectedSast = Array.from({ length: 21 }, (_, i) => `SAST-${String(i + 1).padStart(3, '0')}`);
const expectedExp = Array.from({ length: 21 }, (_, i) => `EXP-${String(i + 1).padStart(3, '0')}`);
const expectedRR = Array.from({ length: 11 }, (_, i) => `RR-${String(i + 1).padStart(2, '0')}`);

let strideFound = new Set();
let vulnFound = new Set();
let sastFound = new Set();
let expFound = new Set();
let rrFound = new Set();

mdFiles.forEach(file => {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  report.scannedFiles.push(file);

  expectedStride.forEach(id => { if (content.includes(id)) strideFound.add(id); });
  expectedVuln.forEach(id => { if (content.includes(id)) vulnFound.add(id); });
  expectedSast.forEach(id => { if (content.includes(id)) sastFound.add(id); });
  expectedExp.forEach(id => { if (content.includes(id)) expFound.add(id); });
  expectedRR.forEach(id => { if (content.includes(id)) rrFound.add(id); });

  // Scan for Gate A: HOLD
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (/GATE\s+A\s*:\s*HOLD/i.test(l)) {
      report.discrepancies.push({ file, line: idx + 1, text: l.trim(), type: 'GATE A HOLD' });
    }
    // Scan for Phase 5 started
    if (/Phase 5.*(in progress|started|commenced)/i.test(l) && !/not started|halted/i.test(l)) {
      report.discrepancies.push({ file, line: idx + 1, text: l.trim(), type: 'Phase 5 Started Claim' });
    }
  });
});

console.log(`STRIDE found: ${strideFound.size}/20`);
console.log(`VULN found: ${vulnFound.size}/23`);
console.log(`SAST found: ${sastFound.size}/21`);
console.log(`EXP found: ${expFound.size}/21`);
console.log(`RR found: ${rrFound.size}/11`);
console.log(`Discrepancies found: ${report.discrepancies.length}`);

if (report.discrepancies.length > 0) {
  console.log('Discrepancies:', JSON.stringify(report.discrepancies, null, 2));
}

fs.writeFileSync('scratch/final_scan_report.json', JSON.stringify({
  strideFound: Array.from(strideFound),
  vulnFound: Array.from(vulnFound),
  sastFound: Array.from(sastFound),
  expFound: Array.from(expFound),
  rrFound: Array.from(rrFound),
  discrepancies: report.discrepancies
}, null, 2));
