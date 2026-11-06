const fs = require('fs');
const content = fs.readFileSync('C:/Users/nicsi/.gemini/antigravity-ide/brain/ab926d23-5876-4076-93fc-e2b1ae63f066/.system_generated/steps/121/content.md', 'utf8');
const lines = content.split('\n');
for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('{') && trimmed.includes('bom-1.5.schema.json')) {
        fs.writeFileSync('scratch/bom-1.5.schema.json', trimmed, 'utf8');
        console.log('Saved scratch/bom-1.5.schema.json with length:', trimmed.length);
        const parsed = JSON.parse(trimmed);
        console.log('Valid JSON! Schema Title:', parsed.title);
        break;
    }
}
