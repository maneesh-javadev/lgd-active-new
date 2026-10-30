const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const wb = XLSX.readFile('SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx');
const canonData = XLSX.utils.sheet_to_json(wb.Sheets['Canonical Auth Matrix']);
const mapData = XLSX.utils.sheet_to_json(wb.Sheets['153-to-47 Mapping']);

console.log('Total CANON items in Canonical Auth Matrix:', canonData.length);
console.log('Total Test Cases in 153-to-47 Mapping:', mapData.length);

const canon01 = mapData.filter(r => r['Canonical Operation Ref'] === 'CANON-01');
console.log('Rows currently mapped to CANON-01:', canon01.length);
canon01.slice(0, 30).forEach(r => {
    console.log([r['Test Case ID'], r['Target Module'], r['HTTP Method'], r['Endpoint URL']].join(' | '));
});
