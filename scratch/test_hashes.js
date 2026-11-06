const crypto = require('crypto');
function h(s) {
    return crypto.createHash('sha256').update(s).digest('hex').substring(0, 12);
}
console.log('literal "\\$JWT_SECRET":', h('\\$JWT_SECRET'));
console.log('literal "$JWT_SECRET":', h('$JWT_SECRET'));
console.log('literal "\\\"$JWT_SECRET\\\"":', h('\"$JWT_SECRET\"'));
console.log('literal "\\\"\\$JWT_SECRET\\\"":', h('\"\\$JWT_SECRET\"'));
