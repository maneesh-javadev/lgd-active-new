const path = require('path');
const fs = require('fs');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

// Read Master_Finding_Traceability_Register.xlsx
const wbMasterXlsx = XLSX.readFile('Master_Finding_Traceability_Register.xlsx');
const rowsMasterXlsx = XLSX.utils.sheet_to_json(wbMasterXlsx.Sheets[wbMasterXlsx.SheetNames[0]]);

// Read SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx
const wbTraceXlsx = XLSX.readFile('SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx');
const rowsTraceXlsx = XLSX.utils.sheet_to_json(wbTraceXlsx.Sheets['Master Traceability Matrix']);

// Read Master_Finding_Traceability_Register.md
const md1 = fs.readFileSync('Master_Finding_Traceability_Register.md', 'utf8');

// Read SECURITY_MASTER_FINDING_REGISTER.md
const md2 = fs.readFileSync('SECURITY_MASTER_FINDING_REGISTER.md', 'utf8');

console.log('Comparing 21 findings across all 4 files:');
for (let i = 1; i <= 21; i++) {
  const sastId = 'SAST-' + String(i).padStart(3, '0');
  const inMasterXlsx = rowsMasterXlsx.some(r => r['SAST ID'] === sastId);
  const inTraceXlsx = rowsTraceXlsx.some(r => r['sastId'] === sastId);
  const inMd1 = md1.includes(sastId);
  const inMd2 = md2.includes(sastId);
  console.log(sastId + ' | MasterXlsx: ' + inMasterXlsx + ' | TraceXlsx: ' + inTraceXlsx + ' | MasterMD: ' + inMd1 + ' | SecMasterMD: ' + inMd2);
}
