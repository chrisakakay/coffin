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
        let fName = path.join(__dirname, 'data', new Date().getTime() + '.js');

        runner.saveToFile(fName, code);

        let child = spawn('node', [ch, fName]);

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            let result = JSON.parse(runner.readFromFile(fName + '-result.json'));
            cb(result);
        });
    }

    runSync(code) {
        return runner.runSync(code, this.options);
    }
}

module.exports = Coffin;
