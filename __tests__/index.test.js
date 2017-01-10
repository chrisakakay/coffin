'use strict'

const Coffin = require('../index');

describe('Coffin', () => {
    let coffin;
    const constructorCode = `return new Function("return (this.constructor.constructor('return (this.process.mainModule.constructor._load)')())")()("util").inspect("hi")`;

    beforeEach(() => {
        coffin = new Coffin();
    });

    describe('base', () => {
        it('should have default options', function() {
            expect(coffin.options).toEqual({ timeout: 500 });
        });

        it('should have setOptions function', function() {
            coffin.setOptions({ timeout: 100 });

            expect(coffin.options).toEqual({ timeout: 100 });
        });
    });

    describe('callback', () => {
        it('should not execute empty', (done) => {
            coffin.run('', (output) => {
                expect(output).toEqual({ error: 'SyntaxError: No code given to run.' });
                done();
            });
        });

        it('should handle syntax errors', (done) => {
            coffin.run('hi )there', (output) => {
                expect(output).toEqual({ error: 'SyntaxError: Unexpected token )' });
                done();
            });
        });

        it('should prevent code from accessing node 1', (done) => {
            coffin.run('process.platform', (output) => {
                expect(output).toEqual({ error: 'ReferenceError: process is not defined' });
                done();
            });
        });

        it('should prevent code from accessing node 2', (done) => {
            coffin.run('require("fs")', (output) => {
                expect(output).toEqual({ error: 'ReferenceError: require is not defined' });
                done();
            });
        });

        it('should prevent code from accessing node 3', (done) => {
            coffin.run('globals', (output) => {
                expect(output).toEqual({ error: 'ReferenceError: globals is not defined' });
                done();
            });
        });

        it('should handle console.log 1', (done) => {
            coffin.run('console.log("abc")', (output) => {
                expect(output).toEqual({ result: undefined, console: ['abc'] });
                done();
            });
        });

        it('should handle console.log 2', (done) => {
            coffin.run('console.log("abc", "def")', (output) => {
                expect(output).toEqual({ result: undefined, console: ['abc def'] });
                done();
            });
        });

        it('should handle console.log 3', (done) => {
            coffin.run('console.log("abc"); console.log("def");', (output) => {
                expect(output).toEqual({ result: undefined, console: ['abc', 'def'] });
                done();
            });
        });

        it('should execute basic js 1', (done) => {
            coffin.run('return 1 + 1', (output) => {
                expect(output).toEqual({ result: undefined, console: [], returnValue: 2 });
                done();
            });
        });

        it('should execute basic js 2', (done) => {
            coffin.run('1 + 1', (output) => {
                expect(output).toEqual({ result: undefined, console: [] });
                done();
            });
        });

        it('should execute function with return 1', (done) => {
            coffin.run('function d(i) { return i * 2; }; return d(3)', (output) => {
                expect(output).toEqual({ result: undefined, console: [], returnValue: 6 });
                done();
            });
        });

        it('should execute function with return 2', (done) => {
            coffin.run('function d(i) { return i * 2; }; result = d(3);', (output) => {
                expect(output).toEqual({ result: 6, console: [] });
                done();
            });
        });

        it('should execute function with return 3', (done) => {
            coffin.run('return [1, 2, 3].map(val => val * 2)', (output) => {
                expect(output).toEqual({ result: undefined, console: [], returnValue: [2,4,6] });
                done();
            });
        });

        it('should return objects', (done) => {
            coffin.run('return { a: 1, b: 2, c: 3 }', (output) => {
                expect(output).toEqual({ result: undefined, console: [], returnValue: { a: 1, b: 2, c: 3 } });
                done();
            });
        });

        it('should timeout', (done) => {
            coffin.setOptions({ timeout: 50 });
            coffin.run('while ( true ) {}', (output) => {
                expect(output).toEqual({ error: 'Error: Script execution timed out.' });
                done();
            });
        });

        it('should not allow acces to process through constructor', (done) => {
            coffin.run(constructorCode, (output) => {
                expect(output).toEqual({ error: "TypeError: Cannot read property 'mainModule' of undefined" });
                done();
            });
        });

        it('should not block execution', (done) => {
            let a = 1;
            coffin.setOptions({ timeout: 50 });
            coffin.run('while ( true ) {}', (output) => {
                a = 2;
                expect(output).toEqual({ error: 'Error: Script execution timed out.' });
                done();
            });
            expect(a).toEqual(1);
        });
    });

    describe('sync', function() {
        it('should not execute empty', () => {
            expect(coffin.runSync('')).toEqual({ error: 'SyntaxError: No code given to run.' });
        });

        it('should handle syntax errors 2', () => {
            expect(coffin.runSync('hi )there')).toEqual({ error: 'SyntaxError: Unexpected token )' });
        });

        it('should prevent code from accessing node 1', () => {
            expect(coffin.runSync('process.platform')).toEqual({ error: 'ReferenceError: process is not defined' });
        });

        it('should prevent code from accessing node 2', () => {
            expect(coffin.runSync('require("fs")')).toEqual({ error: 'ReferenceError: require is not defined' });
        });

        it('should prevent code from accessing node 3', () => {
            expect(coffin.runSync('globals')).toEqual({ error: 'ReferenceError: globals is not defined' });
        });

        it('should handle console.log 1', () => {
            expect(coffin.runSync('console.log("abc")')).toEqual({ result: undefined, console: ['abc'] });
        });

        it('should handle console.log 2', () => {
            expect(coffin.runSync('console.log("abc", "def")')).toEqual({ result: undefined, console: ['abc def'] });
        });

        it('should handle console.log 3', () => {
            expect(coffin.runSync('console.log("abc"); console.log("def");')).toEqual({ result: undefined, console: ['abc', 'def'] });
        });

        it('should execute basic js 1', () => {
            expect(coffin.runSync('return 1 + 1')).toEqual({ result: undefined, console: [], returnValue: 2 });
        });

        it('should execute basic js 2', () => {
            expect(coffin.runSync('1 + 1')).toEqual({ result: undefined, console: [] });
        });

        it('should execute function with return 1', () => {
            expect(coffin.runSync('function d(i) { return i * 2; }; return d(3)')).toEqual({ result: undefined, console: [], returnValue: 6 });
        });

        it('should execute function with return 2', () => {
            expect(coffin.runSync('return [1, 2, 3].map(val => val * 2)')).toEqual({ result: undefined, console: [], returnValue: [2,4,6] });
        });

        it('should execute function with return 3', () => {
            expect(coffin.runSync('function d(i) { return i * 2; }; result = d(3);')).toEqual({ result: 6, console: [] });
        });

        it('should return objects', function() {
            expect(coffin.runSync('return { a: 1, b: 2, c: 3 }')).toEqual({ result: undefined, console: [], returnValue: { a: 1, b: 2, c: 3 } });
        });

        it('should timeout', () => {
            coffin.setOptions({ timeout: 50 });
            expect(coffin.runSync('while ( true ) {}')).toEqual({ error: 'Error: Script execution timed out.' });
        });

        it('should not allow acces to process through constructor', () => {
            expect(coffin.runSync(constructorCode)).toEqual({ error: "TypeError: Cannot read property 'mainModule' of undefined" });
        });
    });
});
