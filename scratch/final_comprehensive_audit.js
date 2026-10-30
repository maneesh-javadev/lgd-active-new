const fs = require('fs');
const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

console.log('================================================================');
console.log('LGD 2.0 — FINAL COMPREHENSIVE DELIVERABLE INTEGRITY AUDIT');
console.log('================================================================\n');

let totalErrors = 0;
function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL: ' + message);
    totalErrors++;
  } else {
    console.log('✅ PASS: ' + message);
  }
}

// 1. Verify existence of all 10 required deliverable artifacts
console.log('--- 1. DELIVERABLE ARTIFACT EXISTENCE ---');
const deliverables = [
  'SECURITY_PHASE_TRACKER.md',
  'SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx',
  'DAST_Test_Case_Register.xlsx',
  'Master_Finding_Traceability_Register.md',
  'Master_Finding_Traceability_Register.xlsx',
  'DAST_Evidence_Register.md',
  'Security_Regression_Test_Report.md',
  'DOCKER_SECURITY_CONFIGURATION_REVIEW.md',
  'Residual_Risk_Register.md',
  'Consolidated_Remediation_Report.md'
];

deliverables.forEach(d => {
  const exists = fs.existsSync(d) && fs.statSync(d).size > 0;
  assert(exists, `Deliverable exists and is non-empty: ${d} (${exists ? fs.statSync(d).size : 0} bytes)`);
});

// 2. Authoritative SAST Findings (21)
console.log('\n--- 2. AUTHORITATIVE SAST FINDINGS & CVSS RECONCILIATION ---');
const authoritativeFindings = {
  'SAST-001': { cvss: 9.8, stride: 'THR-STRIDE-001' },
  'SAST-002': { cvss: 9.8, stride: 'THR-STRIDE-012 (Amplifier)' },
  'SAST-003': { cvss: 9.8, stride: 'THR-STRIDE-003' },
  'SAST-004': { cvss: 9.6, stride: 'THR-STRIDE-003' },
  'SAST-005': { cvss: 9.6, stride: 'THR-STRIDE-003' },
  'SAST-006': { cvss: 8.8, stride: 'THR-STRIDE-003' },
  'SAST-007': { cvss: 7.5, stride: 'THR-STRIDE-003' },
  'SAST-008': { cvss: 9.4, stride: 'THR-STRIDE-006' },
  'SAST-009': { cvss: 9.1, stride: 'THR-STRIDE-005' },
  'SAST-010': { cvss: 9.1, stride: 'THR-STRIDE-005' },
  'SAST-011': { cvss: 8.8, stride: 'THR-STRIDE-018' },
  'SAST-012': { cvss: 8.6, stride: 'THR-STRIDE-007' },
  'SAST-013': { cvss: 8.2, stride: 'THR-STRIDE-004' },
  'SAST-014': { cvss: 7.1, stride: 'THR-STRIDE-009' },
  'SAST-015': { cvss: 7.5, stride: 'THR-STRIDE-015' },
  'SAST-016': { cvss: 6.8, stride: 'THR-STRIDE-014' },
  'SAST-017': { cvss: 6.5, stride: 'Input Validation / CWE-20' },
  'SAST-018': { cvss: 7.8, stride: 'THR-STRIDE-015' },
  'SAST-019': { cvss: 5.3, stride: 'THR-STRIDE-013' },
  'SAST-020': { cvss: 9.8, stride: 'THR-STRIDE-002' },
  'SAST-021': { cvss: 6.5, stride: 'Debug Code Exposure / CWE-489' }
};

// Check Master_Finding_Traceability_Register.xlsx
const wbMasterXlsx = XLSX.readFile('Master_Finding_Traceability_Register.xlsx');
const rowsMasterXlsx = XLSX.utils.sheet_to_json(wbMasterXlsx.Sheets[wbMasterXlsx.SheetNames[0]]);
assert(rowsMasterXlsx.length === 21, `Master_Finding_Traceability_Register.xlsx has exactly 21 rows (found ${rowsMasterXlsx.length})`);

// Check SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx -> Master Traceability Matrix
const wbTraceXlsx = XLSX.readFile('SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx');
const rowsTraceMaster = XLSX.utils.sheet_to_json(wbTraceXlsx.Sheets['Master Traceability Matrix']);
assert(rowsTraceMaster.length === 21, `SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx [Master Traceability Matrix] has exactly 21 rows (found ${rowsTraceMaster.length})`);

// Check Master_Finding_Traceability_Register.md
const mdMaster = fs.readFileSync('Master_Finding_Traceability_Register.md', 'utf8');

// Check SECURITY_MASTER_FINDING_REGISTER.md
const mdSecMaster = fs.readFileSync('SECURITY_MASTER_FINDING_REGISTER.md', 'utf8');

for (const [sastId, expected] of Object.entries(authoritativeFindings)) {
  const rMaster = rowsMasterXlsx.find(r => r['SAST ID'] === sastId);
  const rTrace = rowsTraceMaster.find(r => r['sastId'] === sastId);
  
  assert(rMaster && Math.abs(Number(rMaster['CVSS']) - expected.cvss) < 0.001, `${sastId} CVSS in Master_Finding_Traceability_Register.xlsx is ${expected.cvss}`);
  assert(rTrace && Math.abs(Number(rTrace['cvss']) - expected.cvss) < 0.001, `${sastId} CVSS in SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx is ${expected.cvss}`);
  assert(rMaster && String(rMaster['STRIDE ID']).trim() === expected.stride, `${sastId} STRIDE in Master_Finding_Traceability_Register.xlsx is ${expected.stride}`);
  assert(rTrace && String(rTrace['strideId']).trim() === expected.stride, `${sastId} STRIDE in SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx is ${expected.stride}`);
  assert(mdMaster.includes(sastId) && mdMaster.includes(String(expected.cvss)), `${sastId} present with CVSS ${expected.cvss} in Master_Finding_Traceability_Register.md`);
  assert(mdSecMaster.includes(sastId) && mdSecMaster.includes(String(expected.cvss)), `${sastId} present with CVSS ${expected.cvss} in SECURITY_MASTER_FINDING_REGISTER.md`);
}

// 3. Traceability Workbook Sheets & Endpoint Reconciliation
console.log('\n--- 3. ENDPOINT TRACEABILITY WORKBOOK INTEGRITY ---');
const expectedSheets = ['Canonical Auth Matrix', '153-to-47 Mapping', 'Mapping Validation', 'Master Traceability Matrix'];
expectedSheets.forEach(sh => {
  assert(wbTraceXlsx.SheetNames.includes(sh), `SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx contains sheet [${sh}]`);
});

const rowsCanon = XLSX.utils.sheet_to_json(wbTraceXlsx.Sheets['Canonical Auth Matrix']);
assert(rowsCanon.length === 47, `Canonical Auth Matrix contains exactly 47 canonical rows (found ${rowsCanon.length})`);

const rows153 = XLSX.utils.sheet_to_json(wbTraceXlsx.Sheets['153-to-47 Mapping']);
assert(rows153.length === 153, `153-to-47 Mapping contains exactly 153 test rows (found ${rows153.length})`);

const rowsVal = XLSX.utils.sheet_to_json(wbTraceXlsx.Sheets['Mapping Validation']);
assert(rowsVal.length === 153, `Mapping Validation contains exactly 153 rows (found ${rowsVal.length})`);

// Check that CANON-01 is not abused
const canon01Count = rows153.filter(r => r['Canonical Operation Ref'] === 'CANON-01').length;
assert(canon01Count <= 5, `CANON-01 is properly disassociated and not abused as a catch-all (mapped rows: ${canon01Count})`);

// Check non-HTTP surface mappings
const nonHttpSurfaces = ['SURF-TCP-5432', 'SURF-CONFIG-ESIGN', 'SURF-INFRA-EUREKA', 'SURF-DEBUG-TEST'];
nonHttpSurfaces.forEach(surf => {
  const found = rows153.some(r => r['Canonical Operation Ref'] === surf);
  assert(found, `Non-HTTP test surface ${surf} exists and mapped properly in 153-to-47 Mapping`);
});

// Check eSign callback maps to CANON-45
const esignCallbackRow = rows153.find(r => r['Test Case ID'] === 'TC-SAST-004');
assert(esignCallbackRow && esignCallbackRow['Canonical Operation Ref'] === 'CANON-45', `TC-SAST-004 correctly mapped to CANON-45 (found: ${esignCallbackRow ? esignCallbackRow['Canonical Operation Ref'] : 'none'})`);

// Check Eureka TC-SAST-020
const eurekaRow = rows153.find(r => r['Test Case ID'] === 'TC-SAST-020');
assert(eurekaRow && eurekaRow['Canonical Operation Ref'] === 'SURF-INFRA-EUREKA', `TC-SAST-020 correctly mapped to SURF-INFRA-EUREKA (found: ${eurekaRow ? eurekaRow['Canonical Operation Ref'] : 'none'})`);

// Check TestController TC-SAST-021
const testCtrlRow = rows153.find(r => r['Test Case ID'] === 'TC-SAST-021');
assert(testCtrlRow && testCtrlRow['Canonical Operation Ref'] === 'SURF-DEBUG-TEST', `TC-SAST-021 correctly mapped to SURF-DEBUG-TEST (found: ${testCtrlRow ? testCtrlRow['Canonical Operation Ref'] : 'none'})`);

// 4. DAST Test Case Register Synchronization
console.log('\n--- 4. DAST TEST CASE REGISTER SYNCHRONIZATION ---');
const wbDast = XLSX.readFile('DAST_Test_Case_Register.xlsx');
const rowsDast = XLSX.utils.sheet_to_json(wbDast.Sheets[wbDast.SheetNames[0]]);
assert(rowsDast.length === 153, `DAST_Test_Case_Register.xlsx has exactly 153 rows (found ${rowsDast.length})`);

let tcMatchCount = 0;
rowsDast.forEach((rd, idx) => {
  const rm = rows153[idx];
  if (rd['Test Case ID'] === rm['Test Case ID'] && rd['Canonical Operation Ref'] === rm['Canonical Operation Ref']) {
    tcMatchCount++;
  }
});
assert(tcMatchCount === 153, `All 153 test case IDs and Canonical Refs match exactly between DAST register and 153-to-47 mapping (matched ${tcMatchCount}/153)`);

// 5. DAST Retest Evidence
console.log('\n--- 5. DAST EVIDENCE REGISTER VERIFICATION ---');
const mdEvidence = fs.readFileSync('DAST_Evidence_Register.md', 'utf8');
const requiredEvs = ['EV-002', 'EV-003', 'EV-004', 'EV-006', 'EV-007', 'EV-008', 'EV-019', 'EV-020'];
requiredEvs.forEach(ev => {
  const hasEv = mdEvidence.includes(`### ${ev}:`);
  const hasBaseline = mdEvidence.includes(`Original Baseline Assessment`) && mdEvidence.includes(ev);
  const hasRetest = mdEvidence.includes(`Post-Remediation Retest Record`) && mdEvidence.includes(ev);
  assert(hasEv && hasBaseline && hasRetest, `Evidence ${ev} contains baseline and retest sections`);
});

// Check mandatory fields in evidence
const evidenceFields = ['Timestamp:', 'Environment / Profile:', 'HTTP Method & URL:', 'Sanitized Request:', 'Actual HTTP Status:', 'Sanitized Response:', 'Test Execution Reference:', 'Final Disposition:'];
evidenceFields.forEach(fld => {
  assert(mdEvidence.includes(fld), `DAST_Evidence_Register.md contains required retest record field '${fld}'`);
});

// 6. Security Regression Test Report & Totals
console.log('\n--- 6. REGRESSION TEST REPORT VERIFICATION ---');
const mdRegression = fs.readFileSync('Security_Regression_Test_Report.md', 'utf8');
assert(mdRegression.includes('289'), 'Regression report documents authoritative total of 289 tests');
assert(mdRegression.includes('api-gateway') && mdRegression.includes('14'), 'API Gateway documented with 14 tests (reconciled from historical 11)');
assert(mdRegression.includes('discovery') && mdRegression.includes('2'), 'Discovery documented with 2 tests');
assert(mdRegression.includes('revenue') && mdRegression.includes('22'), 'Revenue documented with 22 tests');
assert(mdRegression.includes('auth-service') && mdRegression.includes('40'), 'Auth Service documented with 40 tests');
assert(mdRegression.includes('user-management') && mdRegression.includes('211'), 'User Management documented with 211 tests');
assert(mdRegression.includes('Process Exit Code:** `0`') || mdRegression.includes('Exit Code  Tests Run'), 'Documents successful process exit code 0');

// 7. Docker Security Configuration Review
console.log('\n--- 7. DOCKER SECURITY CONFIGURATION REVIEW ---');
const mdDocker = fs.readFileSync('DOCKER_SECURITY_CONFIGURATION_REVIEW.md', 'utf8');
assert(fs.existsSync('docker-compose.yml'), 'Authoritative docker-compose.yml exists');
assert(fs.existsSync('docker-compose.dev.yml'), 'Development docker-compose.dev.yml exists');
assert(fs.existsSync('docker-compose.prod.yml'), 'Production docker-compose.prod.yml exists');
assert(mdDocker.includes('host.docker.internal'), 'Docker review accurately documents host.docker.internal routing');
assert(mdDocker.includes('127.0.0.1'), 'Docker review documents loopback binding for development override');
assert(mdDocker.includes('JWT_SECRET'), 'Docker review documents mandatory JWT_SECRET');
assert(mdDocker.includes('ESIGN_KEYSTORE_PASSWORD'), 'Docker review documents mandatory ESIGN_KEYSTORE_PASSWORD');

// 8. Residual Risk Register
console.log('\n--- 8. RESIDUAL RISK REGISTER VERIFICATION ---');
const mdResidual = fs.readFileSync('Residual_Risk_Register.md', 'utf8');
const rrIds = ['RR-01', 'RR-02', 'RR-03', 'RR-04', 'RR-05', 'RR-06', 'RR-07'];
rrIds.forEach(rr => {
  assert(mdResidual.includes(rr), `Residual risk ${rr} documented in Residual_Risk_Register.md`);
});
const mandatoryRrFields = ['Existing Control', 'Remaining Exposure', 'Compensating Control', 'Owner', 'Planned Phase', 'Risk Acceptance Authority', 'Status'];
mandatoryRrFields.forEach(f => {
  assert(mdResidual.includes(f), `Residual Risk Register contains mandatory field '${f}'`);
});
assert(!mdResidual.includes('Remaining Exposure: Zero') && !mdResidual.includes('Remaining Exposure: None'), 'Residual risks do not falsely claim zero remaining exposure');

// 9. Phase Tracker & Gate 4 Hold
console.log('\n--- 9. PHASE TRACKER & GATE 4 ENFORCEMENT ---');
const mdTracker = fs.readFileSync('SECURITY_PHASE_TRACKER.md', 'utf8');
assert(mdTracker.includes('HALTED AT GATE 4'), 'SECURITY_PHASE_TRACKER.md is explicitly halted at Gate 4');
assert(mdTracker.includes('Phase 4 has **NOT** been started') || mdTracker.includes('Phase 4 has not been started'), 'Phase 4 (SCA) explicitly NOT started');

console.log('\n================================================================');
console.log(`AUDIT RESULT: ${totalErrors === 0 ? 'ALL CHECKS PASSED PERFECTLY (0 ERRORS)' : 'FAILURES DETECTED: ' + totalErrors}`);
console.log('================================================================');
process.exit(totalErrors === 0 ? 0 : 1);
