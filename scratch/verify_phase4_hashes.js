const fs = require('fs');
const crypto = require('crypto');

const files = [
  'SOFTWARE_BILL_OF_MATERIALS.json',
  'SCA_LICENSE_COMPLIANCE_REPORT.md',
  'scratch/package_license_compliance_report.json',
  'scratch/trivy_results/container_scan_summary.json',
  'scratch/live_dast_evidence_records.json',
  'scratch/sbom_graph_validation_report.json',
  'scratch/sbom_validation_output.txt',
  'scratch/validate_sbom_schema.js',
  'scratch/surefire_regression_execution_summary.json',
  'scratch/trivy_results/api-gateway_trivy.json',
  'scratch/trivy_results/auth-service_trivy.json',
  'scratch/trivy_results/revenue_trivy.json',
  'scratch/trivy_results/service-discovery_trivy.json',
  'scratch/trivy_results/user-management_trivy.json',
  'scratch/trivy_results/redis-alpine_trivy.json',
  'scratch/trivy_results/postgresql_host_native_trivy.json',
  'revenue/pom.xml',
  'auth-service/pom.xml',
  'user-management/pom.xml',
  'api-gateway/pom.xml'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const data = fs.readFileSync(f);
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    console.log(`${f} | ${hash} | ${data.length} bytes`);
  } else {
    console.log(`${f} | MISSING`);
  }
}
