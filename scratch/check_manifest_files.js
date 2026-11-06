const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const deliverables = [
    'PHASE_6_CANONICAL_TRACEABILITY_CORRECTION_REPORT.md',
    'PHASE_6_FINAL_FINDING_DISPOSITION_MATRIX.md',
    'PHASE_6_BLOCKER_IDENTITY_RECONCILIATION.md',
    'PHASE_6_SUREFIRE_CENSUS_RECONCILIATION.md',
    'PHASE_6_FINAL_EVIDENCE_REGISTER.md',
    'PHASE_6_FINAL_GATE_DISPOSITION.md',
    'PHASE_6_FINAL_INDEPENDENT_ACCEPTANCE_REPORT.md',
    'PHASE_6_FINAL_EVIDENCE_INTEGRITY_REPORT.md',
    'PHASE_6_BLOCKER_IDENTITY_AND_STATUS_RECONCILIATION.md',
    'PHASE_6_FINAL_SUREFIRE_CENSUS.md',
    'PHASE_6_GATE_A_B_C_FINAL_DISPOSITION.md'
];

const registers = [
    'PHASE_6_RBAC_FINDINGS_REGISTER.md',
    'PHASE_6_AUTHORIZATION_ENDPOINT_MATRIX.md',
    'PHASE_6_EVIDENCE_REGISTER.md',
    'PHASE_6_MULTITENANCY_TEST_REGISTER.md',
    'PHASE_6_GATE_B_REGRESSION_AND_RETEST_REPORT.md',
    'PHASE_6_GATE_B_TECHNICAL_EVIDENCE_REGISTER.md',
    'PHASE_6_GATE_B_TECHNICAL_VERIFICATION_CLOSURE_REPORT.md',
    'RBAC_004_FINAL_CONTROLLER_AUTHORITY_MATRIX.md',
    'RBAC_004_FINAL_EVIDENCE_REGISTER.md',
    'RBAC_004_GOVERNANCE_DISPOSITION.md',
    'RBAC_004_NEGATIVE_POSITIVE_TEST_EVIDENCE.md',
    'RBAC_004_REMEDIATION_AND_RETEST.md',
    'RBAC_004_SUREFIRE_RECONCILIATION.md',
    'BLK_01_EXP_016_TLS_HSTS_VERIFICATION_REPORT.md',
    'BLK_02_EXP_021_REVENUE_TESTCONTROLLER_CENSUS.md',
    'BLK_03_POSTGRESQL14_REVENUE_STEADY_STATE_REPORT.md',
    'GATE_B_GATE_C_CROSS_DOCUMENT_CONSISTENCY_REPORT.md',
    'GATE_B_TECHNICAL_VERIFICATION_CLOSURE_REPORT.md',
    'GATE_C_DAA_CISO_APPROVAL_REQUEST.md',
    'PHASE0_4_REMAINING_BLOCKERS_REGISTER.md'
];

const sourceFiles = [
    'user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleLevelMasterController.java',
    'user-management/src/main/java/in/nic/lgd/usermanagement/modules/master/controller/RoleTypeMasterController.java',
    'user-management/src/main/java/in/nic/lgd/usermanagement/modules/privilege/controller/PrivilegeController.java',
    'user-management/src/main/java/in/nic/lgd/usermanagement/modules/resource/controller/ResourceController.java',
    'user-management/src/main/java/in/nic/lgd/usermanagement/user/security/JwtAuthenticationFilter.java',
    'user-management/src/main/java/in/nic/lgd/usermanagement/user/security/HierarchySecurityUtil.java',
    'user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac001SecurityNegativeTest.java',
    'user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac004EndpointSecurityIntegrationTest.java',
    'user-management/src/test/java/in/nic/lgd/usermanagement/integration/RbacSecurityIntegrationTest.java',
    'user-management/src/main/resources/application.properties',
    'user-management/src/main/resources/application-prod.properties',
    'auth-service/src/main/java/in/nic/lgd/auth/security/JwtUtil.java',
    'auth-service/src/main/java/in/nic/lgd/auth/service/impl/AuthServiceImpl.java',
    'auth-service/src/main/resources/application.properties',
    'auth-service/src/main/resources/application-prod.properties',
    'api-gateway/src/main/java/in/gov/lgd/gateway/filter/SecurityHeadersFilter.java',
    'api-gateway/src/main/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilter.java',
    'api-gateway/src/test/java/in/gov/lgd/gateway/filter/IdentityHeaderSanitizationFilterTest.java',
    'api-gateway/src/main/resources/application.properties',
    'api-gateway/src/main/resources/application-prod.properties',
    'revenue/src/main/java/in/nic/lgd/revenue/controller/TestController.java',
    'revenue/src/main/java/in/nic/lgd/revenue/user/security/JwtAuthenticationFilter.java',
    'revenue/src/main/resources/application.properties',
    'revenue/src/main/resources/application-prod.properties',
    'discovery/src/main/resources/application.properties',
    'docker-compose.yml',
    '.env',
    '.env.example'
];

const censusData = JSON.parse(fs.readFileSync('scratch/surefire_census_data.json', 'utf8'));
const xmlFiles = [];
for (const [s, info] of Object.entries(censusData.services)) {
    info.files.forEach(f => xmlFiles.push(f.file.replace(/\\/g, '/')));
}

console.log('Deliverables:', deliverables.length);
console.log('Registers:', registers.length);
console.log('XMLs:', xmlFiles.length);
console.log('Sources:', sourceFiles.length);

const all = [...deliverables, ...registers, ...xmlFiles, ...sourceFiles];
const missing = all.filter(f => !fs.existsSync(f));
console.log('Missing count:', missing.length);
if (missing.length > 0) {
    console.log('Missing:', missing);
}

