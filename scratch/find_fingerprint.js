const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const targetFp = '1ad37816e1b4';
const rootDir = process.cwd();

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
                // check each line
                const lines = content.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    // check any assignment or potential secret
                    const parts = line.split(/[=:\s]+/);
                    for (const p of parts) {
                        const trimmed = p.replace(/['",]/g, '').trim();
                        if (trimmed.length > 20) {
                            const fp = crypto.createHash('sha256').update(trimmed).digest('hex').substring(0, 12);
                            if (fp === targetFp) {
                                console.log(`FOUND in ${relPath} at line ${i + 1}! Length=${trimmed.length}`);
                            }
                        }
                    }
                }
            } catch (e) {}
        }
    }
}

walk(rootDir);
