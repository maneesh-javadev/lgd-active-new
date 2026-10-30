const fs = require('fs');
const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const md2 = fs.readFileSync('SECURITY_MASTER_FINDING_REGISTER.md', 'utf8');
const wbMasterXlsx = XLSX.readFile('Master_Finding_Traceability_Register.xlsx');
const rowsMasterXlsx = XLSX.utils.sheet_to_json(wbMasterXlsx.Sheets[wbMasterXlsx.SheetNames[0]]);

console.log('Checking SECURITY_MASTER_FINDING_REGISTER.md vs Master_Finding_Traceability_Register.xlsx:');
rowsMasterXlsx.forEach(r => {
  const sastId = r['SAST ID'];
  const cvss = r['CVSS'];
  const stride = r['STRIDE ID'];
  const hasSast = md2.includes(sastId);
  const hasCvss = md2.includes(String(cvss));
  console.log(`${sastId}: inMD=${hasSast}, CVSS(${cvss})=${hasCvss}`);
});
