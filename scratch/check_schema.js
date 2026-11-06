const fs = require('fs');
const s = JSON.parse(fs.readFileSync('scratch/bom-1.5.schema.json', 'utf8'));

function findRefs(obj) {
    let refs = [];
    for (let k in obj) {
        if (k === '$ref' && typeof obj[k] === 'string' && !obj[k].startsWith('#')) {
            refs.push(obj[k]);
        } else if (typeof obj[k] === 'object' && obj[k] !== null) {
            refs = refs.concat(findRefs(obj[k]));
        }
    }
    return refs;
}

console.log('External refs in schema:', [...new Set(findRefs(s))]);
