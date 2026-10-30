const path = require('path');
const fs = require('fs');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const wbTrace = XLSX.readFile('SECURITY_ENDPOINT_TRACEABILITY_MATRIX.xlsx');
const sheetTraceMaster = wbTrace.Sheets['Master Traceability Matrix'];
const rowsTraceMaster = XLSX.utils.sheet_to_json(sheetTraceMaster);

console.log('Trace Master headers:', Object.keys(rowsTraceMaster[0] || {}));
console.log('Row 0:', rowsTraceMaster[0]);
