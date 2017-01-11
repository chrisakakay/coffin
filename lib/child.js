'use strict'

const runner = require('./runner');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
    let message = JSON.parse(data)
    let result  = runner.runSync(message.code, message.options);

    console.log(JSON.stringify(result));

    process.exit();
});
