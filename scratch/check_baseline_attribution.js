const fs = require('fs');
const crypto = require('crypto');
const execSync = require('child_process').execSync;

const csvLines = fs.readFileSync('scratch/pre_remediation_backup/audit_docs_sha256.csv', 'utf8').split('\n');
const backupHashes = {};
for (const line of csvLines) {
  const parts = line.split(',');
  if (parts.length >= 3) {
    const hash = parts[1].replace(/"/g, '').toLowerCase();
    const fullPath = parts[2].replace(/"/g, '').trim();
    const basename = fullPath.split('\\').pop();
    backupHashes[basename] = hash;
  }
}

const status = execSync('git status --porcelain', { encoding: 'utf8' }).split('\n');
const modified = status.filter(l => l.match(/^[ M][Mm] /)).map(l => l.substring(3).trim());

const rootStatus = fs.readFileSync('scratch/pre_remediation_backup/root_status.txt', 'utf8');
const rootPatch = fs.readFileSync('scratch/pre_remediation_backup/root_working_tree.patch', 'utf8');

const diffSummary = [];
for (const f of modified) {
  const inRootStatus = rootStatus.includes(f);
  const inRootPatch = rootPatch.includes('diff --git a/' + f);
  const backupHash = backupHashes[f] || null;
  let currentHash = null;
  if (fs.existsSync(f) && fs.statSync(f).isFile()) {
    currentHash = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  }
  const hashMatchesBackup = backupHash && currentHash ? (backupHash === currentHash) : null;
  diffSummary.push({ f, inRootStatus, inRootPatch, hasBackupHash: !!backupHash, hashMatchesBackup });
}

fs.writeFileSync('scratch/baseline_attribution_summary.json', JSON.stringify(diffSummary, null, 2));
console.log('Saved baseline attribution summary.');
