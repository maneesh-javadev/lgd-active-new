const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.md'));

console.log('--- Checking for SAST-017 with Revenue or VULN-010 ---');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('SAST-017') && (line.toLowerCase().includes('revenue') || line.includes('VULN-010') || line.includes('THR-STRIDE-016'))) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}

console.log('\n--- Checking for OBS-SQLI-01 with THR-STRIDE-012 or VULN-010 ---');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('OBS-SQLI-01') && (line.includes('THR-STRIDE-012') || line.includes('VULN-010'))) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}

console.log('\n--- Checking for VULN-010 mentioning SQL injection ---');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('VULN-010') && (line.toLowerCase().includes('sql') || line.toLowerCase().includes('sqli'))) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}

console.log('\n--- Checking for EXP-003 Phase 0 mappings ---');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('EXP-003') && line.includes('VULN-017')) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}

console.log('\n--- Checking for Redis residual risk (RR-04 or RR-07 instead of RR-05) ---');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if ((line.toLowerCase().includes('redis') || line.toLowerCase().includes('cache')) && (line.includes('RR-04') || line.includes('RR-07'))) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}
