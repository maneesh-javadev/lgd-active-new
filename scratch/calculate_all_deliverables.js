const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = process.cwd();

function hashFile(relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, path: relPath };
  }
  const buf = fs.readFileSync(fullPath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  return {
    exists: true,
    path: relPath,
    bytes: buf.length,
    kb: (buf.length / 1024).toFixed(1),
    sha256: hash
  };
}

const files = [
  // Primary Governance Deliverables
  'DAST_Penetration_Test_Report.md',
  'SECURITY_MASTER_FINDING_REGISTER.md',
  'Consolidated_Remediation_Report.md',
  'SECURITY_PHASE_TRACKER.md',
  'PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md',
  'Master_Finding_Traceability_Register.md',
  'API_Vulnerability_Exploitation_Log.md',
  'DAST_Evidence_Register.md',
  'PHASE1_THREAT_MODEL_VERIFICATION_REPORT.md',
  'PHASE2_SAST_INDEPENDENT_VERIFICATION_REPORT.md',
  'PHASE4_SCA_INDEPENDENT_VERIFICATION_REPORT.md',
  'STRIDE_Threat_Register.md',
  'Attack_Surface_Register.md',

  // Supporting Phase 0-4 Technical Reports
  'PHASE0_BASELINE_RECONCILIATION_REPORT.md',
  'DREAD_Risk_Assessment.md',
  'Trust_Boundary_Analysis.md',
  'Threat_Model_Report.md',
  'Threat_Mitigation_Roadmap.md',
  'Attack_Tree_Diagrams.md',
  'SAST_Findings_Log.md',
  'PHASE1_THREAT_MODEL_REMEDIATION_REPORT.md',
  'PHASE1_PHASE2_PHASE3_SIGNOFF_REPORT.md',
  'PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md',
  'PHASE3_DAST_REMEDIATION_REPORT.md',
  'SCA_LICENSE_COMPLIANCE_REPORT.md',
  'SECURITY_RESIDUAL_RISK_REGISTER.md',
  'PHASE_4_EVIDENCE_REGISTER.md',
  'PHASE0_4_MASTER_TRACEABILITY_AND_DOCUMENT_RECONCILIATION_REPORT.md',
  'PHASE0_4_REMEDIATION_EXECUTION_LOG.md',
  'PHASE0_4_FINAL_REGRESSION_AND_BUILD_REPORT.md',
  'PHASE0_4_EVIDENCE_INDEX.md',
  'PHASE0_4_FINAL_CROSS_DOCUMENT_CONSISTENCY_REPORT.md',
  'PHASE0_4_FINAL_SHA256_RECONCILIATION.md',

  // Raw Evidence Artifacts & Tool Outputs
  'API_Endpoint_Inventory.md',
  'SOFTWARE_BILL_OF_MATERIALS.json',
  'scratch/validate_documentation_semantics.js',
  'scratch/test_validator_negative_fixtures.js',
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

const results = files.map(hashFile);
fs.writeFileSync(path.join(root, 'scratch/recalculated_file_hashes.json'), JSON.stringify(results, null, 2));

console.log('Processed', results.length, 'files.');
results.forEach(r => {
  if (!r.exists) console.log('MISSING:', r.path);
  else console.log(`${r.path}: ${r.bytes} bytes, ${r.sha256}`);
});
