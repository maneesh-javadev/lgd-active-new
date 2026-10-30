const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const wbTrace = XLSX.readFile('SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx');
const sheetMap = wbTrace.Sheets['153-to-47 Mapping'];
const rowsMap = XLSX.utils.sheet_to_json(sheetMap);

console.log('Columns in 153-to-47 Mapping:', Object.keys(rowsMap[0]));
console.log('Row 0:', rowsMap[0]);
console.log('Row 1:', rowsMap[1]);
console.log('Row 2:', rowsMap[2]);
console.log('Row 3:', rowsMap[3]);
console.log('Row 19:', rowsMap[19]);
console.log('Row 20:', rowsMap[20]);
