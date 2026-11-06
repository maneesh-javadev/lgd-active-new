const fs = require('fs');
const path = require('path');

const root = process.cwd();
const mdFiles = fs.readdirSync(root).filter(f => f.endsWith('.md'));

console.log('Found ' + mdFiles.length + ' markdown files in root.');

let issues = [];

mdFiles.forEach(file => {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    // Check for VULN-009 with SAST-020
    if (/VULN-009.*SAST-020|SAST-020.*VULN-009/.test(line)) {
      // exclude historical notes or mentions of disambiguation
      if (!/supersed|disentangle|distinguish|remove|corrected|formerly/i.test(line)) {
        issues.push({ file, lineNum, issue: 'VULN-009 associated with SAST-020', line });
      }
    }
    // Check for VULN-017 with THR-STRIDE-001
    if (/VULN-017.*THR-STRIDE-001|THR-STRIDE-001.*VULN-017/.test(line)) {
      if (!/disentangle|remove|corrected|not.*THR-STRIDE-001/i.test(line)) {
        issues.push({ file, lineNum, issue: 'VULN-017 associated with THR-STRIDE-001', line });
      }
    }
    // Check for VULN-020 with THR-STRIDE-001 or THR-STRIDE-007
    if (/VULN-020.*THR-STRIDE-00[17]|THR-STRIDE-00[17].*VULN-020/.test(line)) {
      if (!/disentangle|remove|corrected|difference between|unsupported/i.test(line)) {
        issues.push({ file, lineNum, issue: 'VULN-020 associated with THR-STRIDE-001 or 007', line });
      }
    }
    // Check for VULN-012 or VULN-023 with THR-STRIDE-014
    if (/VULN-012.*THR-STRIDE-014|THR-STRIDE-014.*VULN-012|VULN-023.*THR-STRIDE-014|THR-STRIDE-014.*VULN-023/.test(line)) {
      if (!/disentangle|remove|corrected|unsupported/i.test(line)) {
        issues.push({ file, lineNum, issue: 'VULN-012/023 associated with THR-STRIDE-014', line });
      }
    }
    // Check for 153 mapping 1-to-1 to 47 operations
    if (/153.*maps?\s+1-to-1|map\s+1-to-1.*153/i.test(line)) {
      if (!/canonical base.*1-to-1|does not map 1-to-1|represent multiple/i.test(line)) {
        issues.push({ file, lineNum, issue: '153 claiming 1-to-1 map', line });
      }
    }
    // Check for Phase 5 started
    if (/Phase 5.*(in progress|started|completed|commenced)/i.test(line) && !/not started|halted/i.test(line)) {
      issues.push({ file, lineNum, issue: 'Phase 5 claiming started', line });
    }
  });
});

console.log('Total potential issues found: ' + issues.length);
issues.forEach(iss => console.log(`[${iss.file}:${iss.lineNum}] ${iss.issue}: ${iss.line.trim()}`));
