const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.md'));
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('api-gateway') && content.includes('auth-service') && content.includes('user-management') && content.includes('revenue') && content.includes('discovery')) {
    console.log('Match found in:', file);
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('api-gateway') || l.includes('Subtotal') || l.includes('TOTAL') || l.includes('discovery') || l.includes('Unique Tested')) {
        console.log(`  ${file}:L${idx+1}: ${l}`);
      }
    });
  }
}
