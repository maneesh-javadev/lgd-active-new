const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Inspect Attack_Tree_Diagrams.md
console.log('=== INSPECTING Attack_Tree_Diagrams.md ===');
const attackTreePath = path.join(rootDir, 'Attack_Tree_Diagrams.md');
if (fs.existsSync(attackTreePath)) {
  const content = fs.readFileSync(attackTreePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('SQLI') || line.includes('VULN-010') || line.includes('Boundary Bypass') || line.includes('VULN-006') || line.includes('VULN-003') || line.includes('VULN-004') || line.includes('Master Data Compromise')) {
      console.log(`L${idx + 1}: ${line}`);
    }
  });
}

// 2. Inspect Threat_Model_Report.md for any remaining stale mappings
console.log('\n=== INSPECTING Threat_Model_Report.md ===');
const threatModelPath = path.join(rootDir, 'Threat_Model_Report.md');
if (fs.existsSync(threatModelPath)) {
  const content = fs.readFileSync(threatModelPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('THR-STRIDE-002') || line.includes('THR-STRIDE-003') || line.includes('THR-STRIDE-004') || line.includes('THR-STRIDE-005') || line.includes('THR-STRIDE-006') || line.includes('THR-STRIDE-007') || line.includes('THR-STRIDE-008') || line.includes('THR-STRIDE-011') || line.includes('THR-STRIDE-012') || line.includes('THR-STRIDE-013') || line.includes('THR-STRIDE-014') || line.includes('THR-STRIDE-016') || line.includes('THR-STRIDE-017') || line.includes('THR-STRIDE-018') || line.includes('THR-STRIDE-019') || line.includes('THR-STRIDE-020')) {
      console.log(`L${idx + 1}: ${line}`);
    }
  });
}

// 3. Inspect DAST tables in files
console.log('\n=== INSPECTING DAST Coverage Tables ===');
const filesToCheck = [
  'PHASE3_FINAL_DAST_INDEPENDENT_VERIFICATION_REPORT.md',
  'DAST_Penetration_Test_Report.md',
  'DAST_Evidence_Register.md',
  'SECURITY_PHASE_TRACKER.md',
  'PHASE0_4_FINAL_INDEPENDENT_AUDIT_DISPOSITION.md'
];

filesToCheck.forEach(file => {
  const fPath = path.join(rootDir, file);
  if (fs.existsSync(fPath)) {
    const content = fs.readFileSync(fPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('47') && (line.includes('Eureka') || line.includes('discovery') || line.includes('Canonical') || line.includes('Coverage') || line.includes('Unique Tested') || line.includes('48'))) {
        console.log(`[${file}] L${idx + 1}: ${line}`);
      }
    });
  }
});
