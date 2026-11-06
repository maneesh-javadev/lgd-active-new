const fs = require('fs');
const path = require('path');

function findXmls(dir) {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== '.git') {
                results = results.concat(findXmls(full));
            }
        } else if (entry.isFile() && entry.name.startsWith('TEST-') && entry.name.endsWith('.xml')) {
            results.push(full);
        }
    }
    return results;
}

const xmlFiles = findXmls('.');
console.log('Total XML files found:', xmlFiles.length);

const services = {};
let totalTestsSum = 0;
let totalFailuresSum = 0;
let totalErrorsSum = 0;
let totalSkippedSum = 0;
const allTestCases = [];

for (const f of xmlFiles) {
    const rel = path.relative('.', f);
    const parts = rel.split(path.sep);
    const serviceName = parts[0];
    if (!services[serviceName]) {
        services[serviceName] = { xmlCount: 0, tests: 0, failures: 0, errors: 0, skipped: 0, files: [] };
    }
    const content = fs.readFileSync(f, 'utf8');
    const suiteMatch = content.match(/<testsuite[^>]+>/);
    if (!suiteMatch) continue;
    const sTag = suiteMatch[0];
    const testsMatch = sTag.match(/tests="(\d+)"/);
    const failuresMatch = sTag.match(/failures="(\d+)"/);
    const errorsMatch = sTag.match(/errors="(\d+)"/);
    const skippedMatch = sTag.match(/skipped="(\d+)"/);
    const nameMatch = sTag.match(/name="([^"]+)"/);
    const timeMatch = sTag.match(/time="([^"]+)"/);

    const tests = testsMatch ? parseInt(testsMatch[1], 10) : 0;
    const failures = failuresMatch ? parseInt(failuresMatch[1], 10) : 0;
    const errors = errorsMatch ? parseInt(errorsMatch[1], 10) : 0;
    const skipped = skippedMatch ? parseInt(skippedMatch[1], 10) : 0;
    const name = nameMatch ? nameMatch[1] : '';
    const time = timeMatch ? timeMatch[1] : '';

    services[serviceName].xmlCount++;
    services[serviceName].tests += tests;
    services[serviceName].failures += failures;
    services[serviceName].errors += errors;
    services[serviceName].skipped += skipped;
    services[serviceName].files.push({ name, tests, failures, errors, skipped, time, file: rel });

    totalTestsSum += tests;
    totalFailuresSum += failures;
    totalErrorsSum += errors;
    totalSkippedSum += skipped;

    const tcRegex = /<testcase\s+([^>]+)>/g;
    let tcMatch;
    while ((tcMatch = tcRegex.exec(content)) !== null) {
        const attrs = tcMatch[1];
        const nMatch = attrs.match(/name="([^"]+)"/);
        const cMatch = attrs.match(/classname="([^"]+)"/);
        const tMatch = attrs.match(/time="([^"]+)"/);
        allTestCases.push({
            service: serviceName,
            suite: name,
            method: nMatch ? nMatch[1] : '',
            classname: cMatch ? cMatch[1] : '',
            time: tMatch ? tMatch[1] : '',
            file: rel
        });
    }
}

console.log('Services Summary:');
for (const [s, data] of Object.entries(services)) {
    console.log(`  ${s}: ${data.xmlCount} suites, ${data.tests} tests (fail: ${data.failures}, err: ${data.errors}, skip: ${data.skipped})`);
}
console.log(`Grand Total XML suites: ${xmlFiles.length}, Total Tests: ${totalTestsSum}, Individual Testcases Parsed: ${allTestCases.length}`);

// Check unique test keys (classname + '#' + method)
const uniqueMap = new Map();
const duplicates = [];
for (const tc of allTestCases) {
    const key = `${tc.service}::${tc.classname}#${tc.method}`;
    if (uniqueMap.has(key)) {
        duplicates.push({ key, first: uniqueMap.get(key), second: tc });
    } else {
        uniqueMap.set(key, tc);
    }
}

console.log(`Unique test cases across all XMLs: ${uniqueMap.size}`);
console.log(`Duplicate test cases: ${duplicates.length}`);
if (duplicates.length > 0) {
    console.log('Duplicates:', JSON.stringify(duplicates, null, 2));
}

// Write out JSON report for detailed inspection
fs.writeFileSync('scratch/surefire_census_data.json', JSON.stringify({
    services,
    totalTestsSum,
    totalFailuresSum,
    totalErrorsSum,
    totalSkippedSum,
    uniqueCount: uniqueMap.size,
    allTestCases
}, null, 2));

