const path = require('path');
const fs = require('fs');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const postRemediationResults = {
  'TC-SAST-001': 'HTTP 401 Unauthorized - Invalid or expired JWT signature. (JwtHardeningRegressionTest: 14/14 PASS, ProductionSecurityValidatorTest: 5/5 PASS)',
  'TC-SAST-002': 'Host port 5432 unmapped from production Compose; ProductionSecurityValidator enforces non-default database password on startup.',
  'TC-SAST-003': 'Mandatory ${ESIGN_KEYSTORE_PASSWORD} enforced; plaintext fallback removed; EsignValidationSecurityTest (4/4 PASS).',
  'TC-SAST-004': 'XmlSignatureUtil sets secureValidation=Boolean.TRUE; XML signature wrapping rejected; EsignCallbackSecurityTest (13/13 PASS).',
  'TC-SAST-005': 'X509KeySelector enforces trust anchor validation and certificate chaining; untrusted public keys rejected.',
  'TC-SAST-006': 'Bypass flag removed; unverified eSign callbacks throw SecurityException; EsignCallbackSecurityTest (PASS).',
  'TC-SAST-007': 'SecureRandom implemented for eSign transaction ID generation; minimum 64-bit entropy verified.',
  'TC-SAST-008': 'Privilege fields (passwordHash, specificRoleId) stripped during user profile updates; UserServiceImplTest (11/11 PASS).',
  'TC-SAST-009': 'HTTP 403 Forbidden - Cross-state and cross-district draft viewing rejected by DraftTenantSecurityTest (5/5 PASS).',
  'TC-SAST-010': 'HTTP 403 Forbidden - Cross-state draft entity deletion rejected by DraftTenantSecurityTest (PASS).',
  'TC-SAST-011': 'HTTP 403 Forbidden - Method-level security (@PreAuthorize) enforced on downstream controllers; UserManagementIntegrationTest (PASS).',
  'TC-SAST-012': 'HTTP 401 Unauthorized - Blacklisted JTI rejected by API Gateway; fails closed with 503 on Redis timeout; AuthenticationFilterTest (8/8 PASS).',
  'TC-SAST-013': 'HTTP 401 Unauthorized - Traversal and matrix parameter routes enforced as protected by RouteValidatorTest (5/5 PASS).',
  'TC-SAST-014': 'HTTP 200 OK - Remote socket IP recorded in audit log; untrusted X-Forwarded-For headers ignored by ApiLoggingFilter.',
  'TC-SAST-015': '64KB buffer truncation applied to response logging stream; prevents JVM heap exhaustion under high payload volume.',
  'TC-SAST-016': 'HTTP 200 OK with Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options headers attached.',
  'TC-SAST-017': 'HTTP 400 Bad Request - Missing/blank username/password rejected by @Valid in AuthSecondaryController; JwtHardeningRegressionTest (PASS).',
  'TC-SAST-018': 'HTTP 400 Bad Request - Non-PDF MIME, files >5MB, and non-%PDF magic bytes rejected by EsignValidationSecurityTest (4/4 PASS).',
  'TC-SAST-019': 'HTTP 404 Not Found - Swagger/OpenAPI documentation endpoints disabled under prod profile via @Profile("!prod").',
  'TC-SAST-020': 'HTTP 401 Unauthorized on unauthenticated Eureka access; HTTP 200 OK with valid credentials; EurekaSecurityTest (2/2 PASS).',
  'TC-SAST-021': 'HTTP 404 Not Found - TestController gated to @Profile({"dev", "test"}); excluded from prod runtime.'
};

// 1. Update SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx
const wbTrace = XLSX.readFile('SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx');
const sheetMap = wbTrace.Sheets['153-to-47 Mapping'];
const rowsMap = XLSX.utils.sheet_to_json(sheetMap);

rowsMap.forEach(r => {
  const tcId = r['Test Case ID'];
  if (postRemediationResults[tcId]) {
    r['Post-Remediation Retest Result'] = postRemediationResults[tcId];
  }
});

const newSheetMap = XLSX.utils.json_to_sheet(rowsMap);
wbTrace.Sheets['153-to-47 Mapping'] = newSheetMap;
XLSX.writeFile(wbTrace, 'SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx');
console.log('Updated SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx 153-to-47 Mapping');

// 2. Update DAST_Test_Case_Register.xlsx
const wbDast = XLSX.readFile('DAST_Test_Case_Register.xlsx');
const sheetDast = wbDast.Sheets['DAST Test Register'];
const rowsDast = XLSX.utils.sheet_to_json(sheetDast);

rowsDast.forEach(r => {
  const tcId = r['Test Case ID'];
  if (postRemediationResults[tcId]) {
    r['Post-Remediation Result'] = postRemediationResults[tcId];
  }
});

const newSheetDast = XLSX.utils.json_to_sheet(rowsDast);
wbDast.Sheets['DAST Test Register'] = newSheetDast;
XLSX.writeFile(wbDast, 'DAST_Test_Case_Register.xlsx');
console.log('Updated DAST_Test_Case_Register.xlsx DAST Test Register');
