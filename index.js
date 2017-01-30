'use strict';

const runner = require('./lib/runner');

class Coffin {
    constructor(opts) {
        this.options = {
            timeout: (opts && opts.timeout) || 500
        };
    }

    setOptions(opts) {
        let that = this;

        Object.keys(opts).forEach((opt) => {
            that.options[opt] = opts[opt];
        });
    }

    run(code, cb) {
        if (!code) { cb({ error: 'SyntaxError: No code given to run.' }); return; }

        runner.runAsync(code, this.options, cb);
    }

    runSync(code) {
        if (!code) { return { error: 'SyntaxError: No code given to run.' }; }

        return runner.runSync(code, this.options);
    }
}

module.exports = Coffin;
