const fs = require('fs');

const authoritativeCvss = {
  'SAST-001': 9.8,
  'SAST-002': 9.8,
  'SAST-003': 9.8,
  'SAST-004': 9.6,
  'SAST-005': 9.6,
  'SAST-006': 8.8,
  'SAST-007': 7.5,
  'SAST-008': 9.4,
  'SAST-009': 9.1,
  'SAST-010': 9.1,
  'SAST-011': 8.8,
  'SAST-012': 8.6,
  'SAST-013': 8.2,
  'SAST-014': 7.1,
  'SAST-015': 7.5,
  'SAST-016': 6.8,
  'SAST-017': 6.5,
  'SAST-018': 7.8,
  'SAST-019': 5.3,
  'SAST-020': 9.8,
  'SAST-021': 6.5
};

let content = fs.readFileSync('Master_Finding_Traceability_Register.md', 'utf8');

// 1. Update Table 2 header and rows
const oldHeader = '| SAST ID | Phase 0 ID | STRIDE Threat | DAST ID | Finding Title | Severity | CWE | Module | DAST Status | Remediation Status | Retest Status |';
const oldDivider = '|:---|:---|:---|:---|:---|:---:|:---:|:---|:---:|:---:|:---:|';
const newHeader = '| SAST ID | Phase 0 ID | STRIDE Threat | DAST ID | Finding Title | Severity | CVSS | CWE | Module | DAST Status | Remediation Status | Retest Status |';
const newDivider = '|:---|:---|:---|:---|:---|:---:|:---:|:---:|:---|:---:|:---:|:---:|';

content = content.replace(oldHeader, newHeader).replace(oldDivider, newDivider);

// Replace rows in Table 2
for (let i = 1; i <= 21; i++) {
  const sastId = 'SAST-' + String(i).padStart(3, '0');
  const cvss = authoritativeCvss[sastId];
  
  // Find line starting with | **SAST-xxx** |
  const regex = new RegExp(`\\| \\*\\*${sastId}\\*\\* \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\|`);
  content = content.replace(regex, (match, p0, stride, dast, title, sev, cwe, mod, dastStat, remStat, retStat) => {
    let cleanStride = stride.trim();
    if (sastId === 'SAST-017') cleanStride = 'Input Validation / CWE-20';
    if (sastId === 'SAST-021') cleanStride = 'Debug Code Exposure / CWE-489';
    return `| **${sastId}** | ${p0.trim()} | ${cleanStride} | ${dast.trim()} | ${title.trim()} | ${sev.trim()} | **${cvss}** | ${cwe.trim()} | ${mod.trim()} | ${dastStat.trim()} | ${remStat.trim()} | ${retStat.trim()} |`;
  });
}

// 2. Update Section 4 individual finding CVSS values
let currentSast = null;
const lines = content.split('\n');
const newLines = lines.map(line => {
  const mSast = line.match(/### (SAST-\d{3}):/);
  if (mSast) {
    currentSast = mSast[1];
  }
  if (line.includes('CVSS v4.0:') && currentSast) {
    const expected = authoritativeCvss[currentSast];
    return line.replace(/CVSS v4\.0:\s*[\d\.]+/, `CVSS v4.0: ${expected}`);
  }
  return line;
});

fs.writeFileSync('Master_Finding_Traceability_Register.md', newLines.join('\n'), 'utf8');
console.log('Successfully updated Master_Finding_Traceability_Register.md');
