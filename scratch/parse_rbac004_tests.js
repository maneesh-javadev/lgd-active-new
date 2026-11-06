const fs = require('fs');

const content = fs.readFileSync('user-management/src/test/java/in/nic/lgd/usermanagement/integration/Rbac004EndpointSecurityIntegrationTest.java', 'utf8');
const lines = content.split('\n');
let currentDisplay = null;
const tests = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('@DisplayName(')) {
        currentDisplay = line.substring(13, line.length - 1).replace(/^"|"$/g, '');
    } else if (line.startsWith('void ep') || line.startsWith('void global_')) {
        const m = line.match(/void\s+([a-zA-Z0-9_]+)\s*\(/);
        if (m) {
            tests.push({ lineNum: i + 1, method: m[1], display: currentDisplay });
        }
        currentDisplay = null;
    }
}

console.log('Total tests parsed:', tests.length);
fs.writeFileSync('scratch/rbac004_parsed_tests.json', JSON.stringify(tests, null, 2));
console.log('Written to scratch/rbac004_parsed_tests.json');

