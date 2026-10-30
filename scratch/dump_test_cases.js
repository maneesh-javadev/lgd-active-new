const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const wb = XLSX.readFile('SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx');
const mapData = XLSX.utils.sheet_to_json(wb.Sheets['153-to-47 Mapping']);

console.log('=== TC-SAST (21 items) ===');
mapData.filter(r => r['Test Case ID'].startsWith('TC-SAST')).forEach(r => {
    console.log(`${r['Test Case ID']} | ${r['Target Module']} | ${r['HTTP Method']} | ${r['Endpoint URL']} | Current: ${r['Canonical Operation Ref']}`);
});

console.log('\n=== TC-BASE (47 items) ===');
mapData.filter(r => r['Test Case ID'].startsWith('TC-BASE')).forEach(r => {
    console.log(`${r['Test Case ID']} | ${r['Target Module']} | ${r['HTTP Method']} | ${r['Endpoint URL']} | Current: ${r['Canonical Operation Ref']}`);
});

console.log('\n=== TC-FUZZ sample (first 15 items) ===');
mapData.filter(r => r['Test Case ID'].startsWith('TC-FUZZ')).slice(0, 15).forEach(r => {
    console.log(`${r['Test Case ID']} | ${r['Target Module']} | ${r['HTTP Method']} | ${r['Endpoint URL']} | Current: ${r['Canonical Operation Ref']}`);
});
