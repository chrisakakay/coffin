'use strict'

const vm        = require('vm');
const Sandbox   = require('./sandbox');

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
    runSync
}
