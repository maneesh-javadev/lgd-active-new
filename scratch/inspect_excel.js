const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));
const fs = require('fs');

const files = [
    'Master_Finding_Traceability_Register.xlsx',
    'STRIDE_Threat_Register.xlsx',
    'DREAD_Risk_Assessment.xlsx',
    'DAST_Test_Case_Register.xlsx'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        const wb = XLSX.readFile(f);
        console.log(`\n=== File: ${f} ===`);
        console.log(`Sheet names: ${wb.SheetNames.join(', ')}`);
        wb.SheetNames.forEach(sheetName => {
            const sheet = wb.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            console.log(`  Sheet [${sheetName}]: ${data.length} rows`);
            if (data.length > 0) {
                console.log(`  Headers: ${JSON.stringify(data[0])}`);
                if (data.length > 1) {
                    console.log(`  Row 1: ${JSON.stringify(data[1])}`);
                }
            }
        });
    } else {
        console.log(`File not found: ${f}`);
    }
});
