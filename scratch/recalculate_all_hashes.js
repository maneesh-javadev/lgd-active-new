const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const filesToHash = [
  'DAST_Penetration_Test_Report.md',
  'SECURITY_MASTER_FINDING_REGISTER.md',
  'Consolidated_Remediation_Report.md',
  'SECURITY_PHASE_TRACKER.md',
  'PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md',
  'Master_Finding_Traceability_Register.md',
  'API_Vulnerability_Exploitation_Log.md',
  'DAST_Evidence_Register.md',
  'PHASE0_BASELINE_RECONCILIATION_REPORT.md',
  'PHASE1_THREAT_MODEL_VERIFICATION_REPORT.md',
  'STRIDE_Threat_Register.md',
  'DREAD_Risk_Assessment.md',
  'Trust_Boundary_Analysis.md',
  'Threat_Model_Report.md',
  'Threat_Mitigation_Roadmap.md',
  'Attack_Tree_Diagrams.md',
  'PHASE2_SAST_INDEPENDENT_VERIFICATION_REPORT.md',
  'SAST_Findings_Log.md',
  'PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md',
  'PHASE4_SCA_INDEPENDENT_VERIFICATION_REPORT.md',
  'SCA_LICENSE_COMPLIANCE_REPORT.md',
  'SECURITY_RESIDUAL_RISK_REGISTER.md',
  'PHASE_4_EVIDENCE_REGISTER.md',
  'PHASE0_4_MASTER_TRACEABILITY_AND_DOCUMENT_RECONCILIATION_REPORT.md',
  'PHASE0_4_REMEDIATION_EXECUTION_LOG.md',
  'PHASE0_4_FINAL_REGRESSION_AND_BUILD_REPORT.md',
  'API_Endpoint_Inventory.md',
  'SOFTWARE_BILL_OF_MATERIALS.json',
  'scratch/validate_sbom_schema.js',
  'scratch/sbom_validation_output.txt',
  'scratch/sbom_graph_validation_report.json',
  'scratch/package_license_compliance_report.json',
  'scratch/live_dast_evidence_records.json',
  'scratch/all_153_tests.json',
  'scratch/surefire_regression_execution_summary.json',
  'scratch/trivy_results/container_scan_summary.json',
  'scratch/trivy_results/postgresql_host_native_trivy.json',
  'scratch/trivy_results/api-gateway_trivy.json',
  'scratch/trivy_results/auth-service_trivy.json',
  'scratch/trivy_results/revenue_trivy.json',
  'scratch/trivy_results/service-discovery_trivy.json',
  'scratch/trivy_results/user-management_trivy.json',
  'scratch/trivy_results/redis-alpine_trivy.json',
  'revenue/pom.xml',
  'auth-service/pom.xml',
  'user-management/pom.xml',
  'api-gateway/pom.xml',
  'discovery/pom.xml'
];

console.log('Calculating cryptographic hashes and byte sizes...\n');
const results = {};

for (const relPath of filesToHash) {
  if (!fs.existsSync(relPath)) {
    console.log(`MISSING: ${relPath}`);
    results[relPath] = { exists: false };
    continue;
  }
  const raw = fs.readFileSync(relPath);
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  const sizeBytes = raw.length;
  const sizeKb = (sizeBytes / 1024).toFixed(1);
  results[relPath] = {
    exists: true,
    bytes: sizeBytes,
    sizeKb: sizeKb + ' KB',
    sha256: hash
  };
  console.log(`${relPath} | ${sizeBytes} bytes (${sizeKb} KB) | SHA-256: ${hash}`);
}

fs.writeFileSync('scratch/recalculated_file_hashes.json', JSON.stringify(results, null, 2), 'utf8');
console.log('\nWrote scratch/recalculated_file_hashes.json');
