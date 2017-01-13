'use strict';

const vm        = require('vm');
const Sandbox   = require('./sandbox');
const spawn     = require('child_process').spawn;
const path      = require('path');
const ch        = path.join(__dirname, './child.js');

function runSync(code, options) {
    const sandbox = Sandbox.create();
    const context = vm.createContext(sandbox);

    try {
        let script  = new vm.Script(Sandbox.wrapCode(code), { timeout: options.timeout });
        let result  = script.runInNewContext(context, { timeout: options.timeout });

        return { result: result, console: context.console.messages };
    } catch (e) {
        return { error: e.toString() };
    }
}

function runAsync(code, options, cb) {
    let result  = {};
    let message = {
            code: code,
            options: options
        };
    let child   = spawn('node', [ch]);

    child.stdout.on('data', (data) => {
        result = JSON.parse(data.toString('utf8'));
    });

    child.on('close', () => {
        cb(result);
    });

    child.stdin.setEncoding('utf-8');
    child.stdin.write(JSON.stringify(message));
    child.stdin.end();
}

module.exports = {
    runSync,
    runAsync
};
