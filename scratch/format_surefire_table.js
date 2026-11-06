const fs = require('fs');
const data = require('./surefire_census_data.json');

let output = '';
for (const [svc, sdata] of Object.entries(data.services)) {
    output += `\n### ${svc} (${sdata.xmlCount} Suites / ${sdata.tests} Tests)\n\n`;
    output += '| # | Test Suite Class Name | Tests | Fail | Err | Skip | Time (s) | Surefire XML Report File |\n';
    output += '| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |\n';
    sdata.files.forEach((f, i) => {
        const basename = f.file.split(/[\\/]/).pop();
        const fwdPath = f.file.replace(/\\/g, '/');
        output += `| ${i+1} | \`${f.name}\` | ${f.tests} | ${f.failures} | ${f.errors} | ${f.skipped} | ${f.time} | [\`${basename}\`](file:///${fwdPath}) |\n`;
    });
}

fs.writeFileSync('scratch/surefire_table_formatted.md', output);
console.log('Written to scratch/surefire_table_formatted.md');

