const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const compromisedSecret = process.env.SCAN_SECRET || "d7b42a96c1e54807a9b0c7456c2d1b8493018274a58b291c94b7e4f1a2384759";

console.log("=== SCANNING REPOSITORY FILES FOR COMPROMISED SECRET ===");
const rootDir = process.cwd();
const matchedFiles = [];

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(rootDir, fullPath);
        if (entry.isDirectory()) {
            if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'target' || entry.name === 'dist') {
                continue;
            }
            walk(fullPath);
        } else if (entry.isFile()) {
            if (relPath.endsWith('.xlsx') || relPath.endsWith('.p12') || relPath.endsWith('.doc') || relPath.endsWith('.class') || relPath.endsWith('.jar')) {
                continue;
            }
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes(compromisedSecret)) {
                    matchedFiles.push(relPath);
                }
            } catch (e) {
                // Ignore binary read errors
            }
        }
    }
}
walk(rootDir);

console.log("Files containing compromised secret:", matchedFiles);

console.log("\n=== SCANNING GIT HISTORY (REPORTS ONLY COMMIT ID AND FILE PATHS) ===");
try {
    // Run git log -S with name-only, never printing the secret
    const gitLogOutput = execSync(`git log -S"${compromisedSecret}" --name-only --format="COMMIT: %H | Date: %ad | Subject: %s"`, { encoding: 'utf8' });
    if (gitLogOutput.trim().length === 0) {
        console.log("No commits found in Git history matching the compromised secret.");
    } else {
        console.log("Commits and affected files in Git history:");
        console.log(gitLogOutput);
    }
} catch (e) {
    console.error("Git log search error:", e.message);
}
