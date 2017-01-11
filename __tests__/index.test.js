'use strict'

const Coffin = require('../index');

describe('Coffin', () => {
    let coffin;
    const simpleCases = [
        {
            name: 'should not execute empty',
            code: '',
            result: { error: 'SyntaxError: No code given to run.' }
        },
        {
            name: 'should handle syntax errors',
            code: 'hi )there',
            result: { error: 'SyntaxError: Unexpected token )' }
        },
        {
            name: 'should prevent code from accessing node 1',
            code: 'process.platform',
            result: { error: 'ReferenceError: process is not defined' }
        },
        {
            name: 'should prevent code from accessing node 2',
            code: 'require("fs")',
            result: { error: 'ReferenceError: require is not defined' }
        },
        {
            name: 'should prevent code from accessing node 3',
            code: 'globals',
            result: { error: 'ReferenceError: globals is not defined' }
        },
        {
            name: 'should handle console.log 1',
            code: 'console.log("abc")',
            result: { result: undefined, console: ['abc'] }
        },
        {
            name: 'should handle console.log 2',
            code: 'console.log("abc", "def")',
            result: { result: undefined, console: ['abc def'] }
        },
        {
            name: 'should handle console.log 3',
            code: 'console.log("abc"); console.log("def");',
            result: { result: undefined, console: ['abc', 'def'] }
        },
        {
            name: 'should execute basic js 1',
            code: 'return 1 + 1',
            result: { result: undefined, console: [], returnValue: 2 }
        },
        {
            name: 'should execute basic js 2',
            code: '1 + 1',
            result: { result: undefined, console: [] }
        },
        {
            name: 'should execute function with return 1',
            code: 'function d(i) { return i * 2; }; return d(3)',
            result: { result: undefined, console: [], returnValue: 6 }
        },
        {
            name: 'should execute function with return 2',
            code: 'return [1, 2, 3].map(val => val * 2)',
            result: { result: undefined, console: [], returnValue: [2,4,6] }
        },
        {
            name: 'should execute function with return 3',
            code: 'function d(i) { return i * 2; }; result = d(3);',
            result: { result: 6, console: [] }
        },
        {
            name: 'should return objects',
            code: 'return { a: 1, b: 2, c: 3 }',
            result: { result: undefined, console: [], returnValue: { a: 1, b: 2, c: 3 } }
        },
        {
            name: 'should not allow acces to process through constructor',
            code: `return new Function("return (this.constructor.constructor('return (this.process.mainModule.constructor._load)')())")()("util").inspect("hi")`,
            result: { error: "TypeError: Cannot read property 'mainModule' of undefined" }
        }
    ];

    beforeEach(() => {
        coffin = new Coffin();
    });

    function testAsyncRun(testCase) {
        it(testCase.name, function(done) {
            coffin.run(testCase.code, (output) => {
                expect(output).toEqual(testCase.result);
                done();
            });
        });
    }

    function testSyncRun(testCase) {
        it(testCase.name, function() {
            expect(coffin.runSync(testCase.code)).toEqual(testCase.result);
        });
    }

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
        simpleCases.forEach((testCase) => {
            testAsyncRun(testCase);
        })

        it('should timeout', (done) => {
            coffin.setOptions({ timeout: 50 });
            coffin.run('while ( true ) {}', (output) => {
                expect(output).toEqual({ error: 'Error: Script execution timed out.' });
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
        simpleCases.forEach((testCase) => {
            testSyncRun(testCase);
        })

        it('should timeout', () => {
            coffin.setOptions({ timeout: 50 });
            expect(coffin.runSync('while ( true ) {}')).toEqual({ error: 'Error: Script execution timed out.' });
        });
    });
});
