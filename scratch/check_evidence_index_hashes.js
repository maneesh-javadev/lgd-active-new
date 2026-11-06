const fs = require('fs');
const crypto = require('crypto');

const evidenceFiles = [
  { id: 'EVD-P0-01', path: 'PHASE0_BASELINE_RECONCILIATION_REPORT.md' },
  { id: 'EVD-P0-03', path: 'API_Endpoint_Inventory.md' },
  { id: 'EVD-P0-04', path: 'SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx' },
  { id: 'EVD-P1-01', path: 'PHASE1_THREAT_MODEL_VERIFICATION_REPORT.md' },
  { id: 'EVD-P1-02', path: 'STRIDE_Threat_Register.md' },
  { id: 'EVD-P1-03', path: 'DREAD_Risk_Assessment.md' },
  { id: 'EVD-P1-04', path: 'Trust_Boundary_Analysis.md' },
  { id: 'EVD-P2-01', path: 'PHASE2_SAST_INDEPENDENT_VERIFICATION_REPORT.md' },
  { id: 'EVD-P2-02', path: 'SAST_Findings_Log.md' },
  { id: 'EVD-P3-01', path: 'PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md' },
  { id: 'EVD-P3-02', path: 'scratch/live_dast_evidence_records.json' },
  { id: 'EVD-P3-03', path: 'DAST_Test_Case_Register.xlsx' },
  { id: 'EVD-P3-04', path: 'scratch/all_153_tests.json' },
  { id: 'EVD-P3-05', path: 'DAST_Evidence_Register.md' },
  { id: 'EVD-P4-01', path: 'PHASE4_SCA_INDEPENDENT_VERIFICATION_REPORT.md' },
  { id: 'EVD-P4-02', path: 'SOFTWARE_BILL_OF_MATERIALS.json' },
  { id: 'EVD-P4-03', path: 'scratch/validate_sbom_schema.js' },
  { id: 'EVD-P4-04', path: 'scratch/sbom_validation_output.txt' },
  { id: 'EVD-P4-05', path: 'scratch/sbom_graph_validation_report.json' },
  { id: 'EVD-P4-06', path: 'scratch/package_license_compliance_report.json' },
  { id: 'EVD-P4-07', path: 'scratch/trivy_results/container_scan_summary.json' },
  { id: 'EVD-P4-08', path: 'scratch/trivy_results/postgresql_host_native_trivy.json' },
  { id: 'EVD-P4-09', path: 'SCA_LICENSE_COMPLIANCE_REPORT.md' },
  { id: 'EVD-P4-10', path: 'SECURITY_RESIDUAL_RISK_REGISTER.md' },
  { id: 'EVD-P4-11', path: 'scratch/trivy_results/api-gateway_trivy.json' },
  { id: 'EVD-P4-12', path: 'scratch/trivy_results/auth-service_trivy.json' },
  { id: 'EVD-P4-13', path: 'scratch/trivy_results/revenue_trivy.json' },
  { id: 'EVD-P4-14', path: 'scratch/trivy_results/service-discovery_trivy.json' },
  { id: 'EVD-P4-15', path: 'scratch/trivy_results/user-management_trivy.json' },
  { id: 'EVD-P4-16', path: 'scratch/trivy_results/redis-alpine_trivy.json' },
  { id: 'EVD-GOV-01', path: 'PHASE0_4_MASTER_TRACEABILITY_AND_DOCUMENT_RECONCILIATION_REPORT.md' },
  { id: 'EVD-GOV-02', path: 'Master_Finding_Traceability_Register.md' },
  { id: 'EVD-GOV-03', path: 'SECURITY_PHASE_TRACKER.md' },
  { id: 'EVD-GOV-04', path: 'scratch/surefire_regression_execution_summary.json' },
  { id: 'EVD-GOV-05', path: 'PHASE0_4_REMEDIATION_EXECUTION_LOG.md' },
  { id: 'EVD-GOV-06', path: 'PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md' },
  { id: 'EVD-GOV-07', path: 'PHASE_4_EVIDENCE_REGISTER.md' },
  { id: 'EVD-GOV-08', path: 'PHASE0_4_FINAL_REGRESSION_AND_BUILD_REPORT.md' }
];

console.log('ID | Path | SizeBytes | SizeKB | SHA-256');
for (const item of evidenceFiles) {
  if (fs.existsSync(item.path)) {
    const data = fs.readFileSync(item.path);
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    const kb = (data.length / 1024).toFixed(1);
    console.log(`${item.id} | ${item.path} | ${data.length} | ${kb} KB | ${hash}`);
  } else {
    console.log(`${item.id} | ${item.path} | MISSING`);
  }
}
