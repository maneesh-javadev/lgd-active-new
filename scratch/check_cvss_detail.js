const fs = require('fs');

const md = fs.readFileSync('Master_Finding_Traceability_Register.md', 'utf8');
const lines = md.split('\n');

const authoritativeCvss = {
  'SAST-001': 9.8,
  'SAST-002': 9.8,
  'SAST-003': 9.8,
  'SAST-004': 9.6,
  'SAST-005': 9.6,
  'SAST-006': 8.8,
  'SAST-007': 7.5,
  'SAST-008': 9.4,
  'SAST-009': 9.1,
  'SAST-010': 9.1,
  'SAST-011': 8.8,
  'SAST-012': 8.6,
  'SAST-013': 8.2,
  'SAST-014': 7.1,
  'SAST-015': 7.5,
  'SAST-016': 6.8,
  'SAST-017': 6.5,
  'SAST-018': 7.8,
  'SAST-019': 5.3,
  'SAST-020': 9.8,
  'SAST-021': 6.5
};

let currentSast = null;
lines.forEach((l, idx) => {
  const mSast = l.match(/### (SAST-\d{3}):/);
  if (mSast) {
    currentSast = mSast[1];
  }
  const mCvss = l.match(/CVSS v4\.0:\s*([\d\.]+)/);
  if (mCvss && currentSast) {
    const val = parseFloat(mCvss[1]);
    const expected = authoritativeCvss[currentSast];
    if (Math.abs(val - expected) > 0.001) {
      console.log(`Line ${idx+1}: ${currentSast} has CVSS ${val}, expected ${expected}`);
    } else {
      console.log(`Line ${idx+1}: ${currentSast} matches ${expected}`);
    }
  }
});
