const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const evidencePath = path.join(rootDir, 'PHASE0_4_EVIDENCE_INDEX.md');
let content = fs.readFileSync(evidencePath, 'utf8');

const lines = content.split('\n');
const newLines = lines.map(line => {
  // Check if line is a table row with an evidence ID and file path
  // Format: | **ID** | `File Path` | Format / Exact Size | Description | **SHA-256:** `hash` |
  const match = line.match(/^(\|\s*\*\*([^*]+)\*\*\s*\|\s*`([^`]+)`\s*\|\s*)([^|]+)(\|\s*[^|]+\|\s*\*\*SHA-256:\*\*\s*`)([a-f0-9]{64})(`\s*\|)$/i);
  if (match) {
    const prefix = match[1];
    const filePath = match[3].trim();
    const mid = match[5];
    const oldHash = match[6];
    const suffix = match[7];
    
    const fullPath = path.join(rootDir, filePath);
    if (fs.existsSync(fullPath)) {
      const buf = fs.readFileSync(fullPath);
      const newHash = crypto.createHash('sha256').update(buf).digest('hex');
      const newBytes = buf.length;
      
      // Determine format string
      let format = 'Markdown';
      if (filePath.endsWith('.json')) format = 'JSON';
      else if (filePath.endsWith('.txt')) format = 'TXT';
      else if (filePath.endsWith('.xml')) format = 'XML';
      else if (filePath.endsWith('.js')) format = 'JavaScript';
      else if (filePath.endsWith('.xlsx')) format = 'Excel';
      
      const newSizeStr = `${format} (${newBytes.toLocaleString()} bytes) `;
      return `${prefix}${newSizeStr}${mid}${newHash}${suffix}`;
    }
  }
  return line;
});

fs.writeFileSync(evidencePath, newLines.join('\n'), 'utf8');
console.log('Successfully updated PHASE0_4_EVIDENCE_INDEX.md with exact sizes and hashes.');
