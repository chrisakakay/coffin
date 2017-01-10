'use strict'

const runner = require('./runner');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(code) {
    let result  = runner.runSync(code, { timeout: 500 });

    console.log(JSON.stringify(result));

    process.exit();
});
