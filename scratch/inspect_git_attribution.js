const fs = require('fs');
const execSync = require('child_process').execSync;

const status = execSync('git status --porcelain', { encoding: 'utf8' });
const lines = status.split('\n');
const modified = [];
for (const line of lines) {
  if (line.match(/^[ M][Mm] /)) {
    modified.push(line.substring(3).trim());
  }
}

const rootStatus = fs.readFileSync('scratch/pre_remediation_backup/root_status.txt', 'utf8');
const rootPatch = fs.readFileSync('scratch/pre_remediation_backup/root_working_tree.patch', 'utf8');

const table = modified.map((f, i) => {
  const inRootStatus = rootStatus.includes(f);
  const inRootPatch = rootPatch.includes('diff --git a/' + f);
  let lastCommit = '';
  try {
    lastCommit = execSync(`git log -1 --format="%h | %cd | %s" -- "${f}"`, { encoding: 'utf8' }).trim();
  } catch (e) {
    lastCommit = 'N/A';
  }
  return { id: i + 1, file: f, inRootStatus, inRootPatch, lastCommit };
});

fs.writeFileSync('scratch/attribution_analysis.json', JSON.stringify(table, null, 2));
console.log('Saved 52 items to scratch/attribution_analysis.json');
