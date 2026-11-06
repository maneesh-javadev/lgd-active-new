const fs = require('fs');
const path = require('path');
const root = process.cwd();
const files = fs.readdirSync(root).filter(f => f.endsWith('.md'));
for (const file of files) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (/(dread.*(fixed|remediat|closed|retest|resolve|all\s+20)|all\s+20.*dread)/i.test(l)) {
      console.log(`[${file}:${idx + 1}] ${l.trim()}`);
    }
  });
}
