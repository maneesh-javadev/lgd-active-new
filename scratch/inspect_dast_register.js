const path = require('path');
const XLSX = require(path.resolve(__dirname, '../lgd_react/node_modules/xlsx'));

const wbDast = XLSX.readFile('DAST_Test_Case_Register.xlsx');
const sheetDast = wbDast.Sheets[wbDast.SheetNames[0]];
const rowsDast = XLSX.utils.sheet_to_json(sheetDast);

console.log('DAST_Test_Case_Register columns:', Object.keys(rowsDast[0]));
console.log('Total rows:', rowsDast.length);
console.log('First 3 rows:');
for (let i = 0; i < 3; i++) console.log(rowsDast[i]);
console.log('Row 21:');
console.log(rowsDast[21]);
console.log('Row 68:');
console.log(rowsDast[68]);
console.log('Last row:');
console.log(rowsDast[rowsDast.length - 1]);
