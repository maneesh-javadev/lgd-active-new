const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const targetDir = path.join(rootDir, 'SECURITY_AUDIT_CONTROLLER', 'evidence', 'phase_9');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

function run(cmd, cwd = rootDir) {
    try {
        return execSync(cmd, { cwd, encoding: 'utf8' }).trim();
    } catch (e) {
        return `ERROR: ${e.message}`;
    }
}

const rootBranch = run('git branch --show-current');
const rootHead = run('git rev-parse HEAD');
const rootStatus = run('git status --short');
const rootUntracked = run('git ls-files --others --exclude-standard');

let output = `# LGD 2.0 — Phase 9 Git Integrity & Baseline Snapshot\n`;
output += `**Evaluation Timestamp:** ${new Date().toISOString()}\n`;
output += `**Operating Directory:** \`${rootDir}\`\n\n`;
output += `## 1. Root Platform Repository\n`;
output += `- **Branch:** \`${rootBranch}\`\n`;
output += `- **HEAD Commit:** \`${rootHead}\`\n\n`;
output += `### Root Modified & Staged Files\n\`\`\`\n${rootStatus}\n\`\`\`\n\n`;
output += `### Root Untracked Files Count\n`;
const untrackedList = rootUntracked.split('\n').filter(Boolean);
output += `- Total untracked files: ${untrackedList.length}\n\n`;

output += `## 2. Nested Git Repositories\n\n`;
const entries = fs.readdirSync(rootDir, { withFileTypes: true });
for (const entry of entries) {
    if (entry.isDirectory()) {
        const subGit = path.join(rootDir, entry.name, '.git');
        if (fs.existsSync(subGit)) {
            const subDir = path.join(rootDir, entry.name);
            const subBranch = run('git branch --show-current', subDir);
            const subHead = run('git rev-parse HEAD', subDir);
            const subStatus = run('git status --short', subDir);
            output += `### Module: \`${entry.name}\`\n`;
            output += `- **Path:** \`${entry.name}/\`\n`;
            output += `- **Branch:** \`${subBranch}\`\n`;
            output += `- **HEAD Commit:** \`${subHead}\`\n`;
            output += `- **Working Tree Status:**\n\`\`\`\n${subStatus || '(clean)'}\n\`\`\`\n\n`;
        }
    }
}

const snapshotPath = path.join(targetDir, 'PHASE_9_GIT_INTEGRITY_SNAPSHOT.md');
fs.writeFileSync(snapshotPath, output, 'utf8');
console.log(`Snapshot saved to ${snapshotPath}`);

