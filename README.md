Coffin
=========

A small and fast module providing sandboxed javasript execution for node

## Installation

    npm install coffinjs --save

## Usage

As a sync function:
``` javascript
const Coffin = require('coffinjs');

let coffin = new Coffin();
let result = coffin.runSync('console.log("a"); return 1 + 1;');

// -> { console: ["a"], result: 2 }
```

With callback:
``` javascript
const Coffin = require('coffinjs');

let coffin = new Coffin();
coffin.run('console.log("a"); return 1 + 1;', (result) => {
    // -> { console: ["a"], result: 2 }
});
```

Setting options:
``` javascript
const Coffin = require('coffinjs');

let coffin = new Coffin({ timeout: 200 });

// or

let coffin = new Coffin();
coffin.setOptions({ timeout: 200 });

```

## API

* __.setOptions( )__
* __.run(__ code __,__ callback __)__
* __.runSync(__ code __)__

## Options

* timeout: 200  // 200ms timeout

## Tests
    npm run test
    npm run test:watch
    npm run test:coverage

## Contributing

Please try to keep the coding style (mostly Crockford) and always write tests for any new or changed code.
Lint will be added later.
