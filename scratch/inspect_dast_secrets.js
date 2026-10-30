const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const wb = XLSX.readFile('DAST_Test_Case_Register.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log(`Total rows: ${data.length}`);
console.log(`Headers: ${JSON.stringify(data[0])}`);

let secretsFound = 0;
data.forEach((row, idx) => {
    const text = JSON.stringify(row);
    // check for known secrets or passwords
    if (text.includes('404E63') || text.includes('postgres@206') || text.includes('amITbPANCH') || text.includes('eyJhbGciOi')) {
        console.log(`Potential secret at row ${idx}: ${text.substring(0, 150)}...`);
        secretsFound++;
    }
});
console.log(`Total rows with potential secrets: ${secretsFound}`);

// Check unique endpoints in DAST
const endpoints = new Set();
for (let i = 1; i < data.length; i++) {
    if (data[i] && data[i][2]) {
        endpoints.add(data[i][2]);
    }
}
console.log(`Distinct endpoints in DAST register: ${endpoints.size}`);
