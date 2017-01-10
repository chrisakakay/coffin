'use strict'

function wrapCode(code) {
    return '(function () {' + code + '}())';
}

function create() {
    let sandbox = Object.create(null);

    sandbox.console = {
        messages: [],
        log: function() {
            let msg = [];
            let i   = 0;

            for (i; i < arguments.length; i++) {
                msg.push(arguments[i].toString());
            }

            this.messages.push(msg.join(' '));
        }
    };
    sandbox.result = undefined;

    return sandbox;
}

module.exports = {
    wrapCode,
    create
}
