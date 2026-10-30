const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));
const fs = require('fs');

console.log("=== FINAL VERIFICATION AUDIT ===");

// 1. Verify Master_Finding_Traceability_Register.xlsx
const masterWb = XLSX.readFile('Master_Finding_Traceability_Register.xlsx');
const masterData = XLSX.utils.sheet_to_json(masterWb.Sheets[masterWb.SheetNames[0]], { header: 1 });
console.log(`1. Master Traceability Excel rows: ${masterData.length - 1} (Expected: 21)`);
const sastIdsInExcel = masterData.slice(1).map(r => r[0]);
console.log(`   First SAST ID: ${sastIdsInExcel[0]}, Last SAST ID: ${sastIdsInExcel[sastIdsInExcel.length - 1]}`);

// Check statuses in Excel
const statuses = new Set(masterData.slice(1).map(r => r[13])); // Remediation Status column
console.log(`   Remediation Statuses in Excel:`, Array.from(statuses));

// 2. Verify STRIDE Excel
const strideWb = XLSX.readFile('STRIDE_Threat_Register.xlsx');
const strideData = XLSX.utils.sheet_to_json(strideWb.Sheets[strideWb.SheetNames[0]], { header: 1 });
console.log(`2. STRIDE Excel threat rows: ${strideData.length - 1} (Expected: 20)`);

// 3. Verify DREAD Excel
const dreadWb = XLSX.readFile('DREAD_Risk_Assessment.xlsx');
const dreadData = XLSX.utils.sheet_to_json(dreadWb.Sheets[dreadWb.SheetNames[0]], { header: 1 });
console.log(`3. DREAD Excel threat rows: ${dreadData.length - 1} (Expected: 20)`);
let critCount = 0, highCount = 0;
dreadData.slice(1).forEach(r => {
    if (r[10] === 'Critical') critCount++;
    if (r[10] === 'High') highCount++;
});
console.log(`   DREAD Critical: ${critCount}, High: ${highCount} (Expected: 12 Critical, 8 High)`);

// 4. Verify DAST Test Case Register
const dastWb = XLSX.readFile('DAST_Test_Case_Register.xlsx');
const dastData = XLSX.utils.sheet_to_json(dastWb.Sheets[dastWb.SheetNames[0]], { header: 1 });
console.log(`4. DAST Test Case Register rows: ${dastData.length - 1} (Expected: 153)`);

// 5. Verify Deliverable files exist
const requiredFiles = [
    'SECURITY_PHASE_TRACKER.md',
    'Master_Finding_Traceability_Register.md',
    'Master_Finding_Traceability_Register.xlsx',
    'STRIDE_Threat_Register.md',
    'STRIDE_Threat_Register.xlsx',
    'DREAD_Risk_Assessment.md',
    'DREAD_Risk_Assessment.xlsx',
    'Threat_Mitigation_Roadmap.md',
    'Consolidated_Remediation_Report.md',
    'DAST_Test_Case_Register.xlsx',
    'DAST_Evidence_Register.md',
    'Security_Regression_Test_Report.md',
    'Residual_Risk_Register.md',
    'Secrets_Rotation_Plan.md'
];

let allExist = true;
requiredFiles.forEach(f => {
    const exists = fs.existsSync(f);
    if (!exists) {
        console.error(`MISSING: ${f}`);
        allExist = false;
    }
});
if (allExist) {
    console.log("5. All 14 required deliverable files exist on disk!");
}
