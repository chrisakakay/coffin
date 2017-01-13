'use strict';

function wrapCode(code) {
    return '(function () {' + code + '}())';
}

function create() {
    let sandbox = Object.create(null);

    sandbox.console = {
        messages: [],
        log: function() {
            this.messages.push(Object.keys(arguments).map(key => arguments[key]).join(' '));
        }
    };
    sandbox.result = undefined;

    return sandbox;
}

module.exports = {
    wrapCode,
    create
};
