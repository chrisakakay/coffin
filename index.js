'use strict'

const runner    = require('./lib/runner');
const path      = require('path');
const spawn     = require('child_process').spawn;
const ch        = path.join(__dirname, './lib/child.js');

class Coffin {
    constructor(opts, context) {
        this.options = {
            timeout: 500
        }
    }

    setOptions(opts) {
        let that = this;

        Object.keys(opts).forEach((opt) => {
            that.options[opt] = opts[opt];
        });
    }

    run(code, cb) {
        if (!code) { cb({ error: 'SyntaxError: No code given to run.' }); return; }

        let result  = {};
        let child   = spawn('node', [ch]);

        child.stdout.on('data', (data) => {
            result = JSON.parse(data.toString('utf8'));
        });

        child.on('close', () => {
            cb(result);
        });

        child.stdin.setEncoding('utf-8');
        child.stdin.write(code);
        child.stdin.end();
    }

    runSync(code) {
        if (!code) { return { error: 'SyntaxError: No code given to run.' }; }

        return runner.runSync(code, this.options);
    }
}

module.exports = Coffin;
