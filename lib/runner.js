'use strict'

const vm        = require('vm');
const fs        = require('fs');
const Sandbox   = require('./sandbox');

function saveToFile(fName, code) {
    fs.writeFileSync(fName, code, { encoding: 'utf8' });
}

function readFromFile(fName) {
    return fs.readFileSync(fName, { encoding: 'utf8' });
}

function runSync(code, options) {
    const sandbox = Sandbox.create();
    const context = vm.createContext(sandbox);
    let script;

    try {
        script          = new vm.Script(Sandbox.wrapCode(code), { timeout: options.timeout });
        let returnValue = script.runInNewContext(context, { timeout: options.timeout });

        return { returnValue: returnValue, result: context.result, console: context.console.messages };
    } catch (e) {
        return { error: e.toString() };
    }
}

module.exports = {
    runSync,
    saveToFile,
    readFromFile
}
