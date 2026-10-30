const fs = require('fs');
const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const wbMasterXlsx = XLSX.readFile('Master_Finding_Traceability_Register.xlsx');
const rowsMasterXlsx = XLSX.utils.sheet_to_json(wbMasterXlsx.Sheets[wbMasterXlsx.SheetNames[0]]);

const md1 = fs.readFileSync('Master_Finding_Traceability_Register.md', 'utf8');

// Parse markdown table rows in Master_Finding_Traceability_Register.md
const lines1 = md1.split('\n');
const mdRows = [];
lines1.forEach(l => {
  if (l.startsWith('| **SAST-') || l.startsWith('| SAST-')) {
    const parts = l.split('|').map(s => s.trim().replace(/\*\*/g, ''));
    // | SAST ID | Phase 0 ID | STRIDE Threat | DAST ID | Finding Title | Severity | CWE | Module | DAST Status | Remediation Status | Retest Status |
    mdRows.push({
      sastId: parts[1],
      phase0Id: parts[2],
      stride: parts[3],
      dastId: parts[4],
      title: parts[5],
      severity: parts[6],
      cwe: parts[7],
      module: parts[8],
      dastStatus: parts[9],
      remediationStatus: parts[10],
      retestStatus: parts[11]
    });
  }
});
console.log('Parsed MD rows:', mdRows.length);
mdRows.forEach(r => {
  const xlsxRow = rowsMasterXlsx.find(x => x['SAST ID'] === r.sastId);
  if (xlsxRow) {
    const strideMatch = (r.stride === xlsxRow['STRIDE ID']);
    if (!strideMatch) {
      console.log(`STRIDE mismatch on ${r.sastId}: MD="${r.stride}" vs XLSX="${xlsxRow['STRIDE ID']}"`);
    }
  }
});
