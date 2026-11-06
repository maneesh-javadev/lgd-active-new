const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

let content = fs.readFileSync('PHASE0_4_EVIDENCE_INDEX.md', 'utf8');
const lines = content.split('\n');

const newLines = lines.map(line => {
  // Regex to match table row with an Evidence ID and backtick-enclosed file path
  // Example: | **EVD-P1-05** | `Threat_Model_Report.md` | Markdown (45,058 bytes) | ... | **SHA-256:** `3a6599...` |
  const rowMatch = line.match(/^(\|\s*\*\*EVD-[^ ]+\*\*\s*\|\s*`([^`]+)`\s*\|\s*)([^|]+)(\|\s*[^|]+\|\s*)(.*)$/);
  if (!rowMatch) return line;

  const prefix = rowMatch[1];
  const filePath = rowMatch[2];
  const currentFormat = rowMatch[3];
  const middle = rowMatch[4];
  const suffix = rowMatch[5];

  if (!fs.existsSync(filePath)) {
    console.log('Skipping non-existent file or directory:', filePath);
    return line;
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    return line;
  }

  const raw = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  const bytes = raw.length;

  // Preserve format description if possible, e.g. "Markdown", "JSON", "Excel", "XML", etc.
  let formatType = 'File';
  if (filePath.endsWith('.md')) formatType = 'Markdown';
  else if (filePath.endsWith('.json')) formatType = 'JSON';
  else if (filePath.endsWith('.xml')) formatType = 'XML';
  else if (filePath.endsWith('.xlsx')) formatType = 'Excel';
  else if (filePath.endsWith('.js')) formatType = 'JavaScript';
  else if (filePath.endsWith('.txt')) formatType = 'TXT';

  const newFormat = `${formatType} (${bytes.toLocaleString('en-US')} bytes) `;

  // In suffix, replace **SHA-256:** `[a-f0-9]{64}` with the new hash
  let newSuffix = suffix;
  if (suffix.includes('SHA-256:')) {
    newSuffix = suffix.replace(/`[a-f0-9]{64}`/, `\`${hash}\``);
  }

  console.log(`Updated ${filePath}: ${bytes} bytes, hash: ${hash.substring(0, 8)}...`);
  return `${prefix}${newFormat}${middle}${newSuffix}`;
});

fs.writeFileSync('PHASE0_4_EVIDENCE_INDEX.md', newLines.join('\n'), 'utf8');
console.log('Successfully synchronized PHASE0_4_EVIDENCE_INDEX.md');
