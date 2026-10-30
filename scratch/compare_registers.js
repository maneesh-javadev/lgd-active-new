const path = require('path');
const fs = require('fs');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const wbMaster = XLSX.readFile('Master_Finding_Traceability_Register.xlsx');
const sheetMaster = wbMaster.Sheets[wbMaster.SheetNames[0]];
const rowsMaster = XLSX.utils.sheet_to_json(sheetMaster);

const wbTrace = XLSX.readFile('SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx');
const sheetTraceMaster = wbTrace.Sheets['Master Traceability Matrix'];
const rowsTraceMaster = XLSX.utils.sheet_to_json(sheetTraceMaster);

console.log('Comparing 21 findings:');
let mismatches = 0;
for (let i = 0; i < 21; i++) {
  const rm = rowsMaster[i] || {};
  const rt = rowsTraceMaster[i] || {};
  const sast = rm['SAST ID'];
  const cvssMaster = Number(rm['CVSS']);
  const cvssTrace = Number(rt['cvss']);
  const strideMaster = String(rm['STRIDE ID']).trim();
  const strideTrace = String(rt['strideId']).trim();
  const cvssMatch = Math.abs(cvssMaster - cvssTrace) < 0.001;
  const strideMatch = (strideMaster === strideTrace);
  if (!cvssMatch || !strideMatch) {
    mismatches++;
    console.log(`Mismatch on ${sast}: Master(CVSS=${cvssMaster}, STRIDE=${strideMaster}) vs Trace(CVSS=${cvssTrace}, STRIDE=${strideTrace})`);
  } else {
    console.log(`Match on ${sast}: CVSS=${cvssMaster}, STRIDE=${strideMaster}`);
  }
}
console.log(`Total mismatches: ${mismatches}`);
