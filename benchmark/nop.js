'use strict'

const Coffin = require('../index');
const Sandbox = require('sandbox');
const code = `
function nop() {}
var i = 10000000;
while (i--) { nop(); }
`;

// Coffin sync
console.time('coffin-sync');
let coffin = new Coffin();
coffin.runSync(code, function () {});
console.timeEnd('coffin-sync');

// Coffin callback
console.time('coffin-async');
let coffinCB = new Coffin();
coffinCB.run(code, function () {
    console.timeEnd('coffin-async');
});

// Eval
console.time('eval');
eval(code);
console.timeEnd('eval');

// Sandbox
console.time('sandbox');
let sandbox = new Sandbox();
sandbox.run(code, function () {
    console.timeEnd('sandbox');
});
