'use strict'

const runner = require('./runner');
const path   = require('path');
const fName  = process.argv[2];
const fs     = require('fs');

if (fName) {
    fs.readFile(fName, 'utf8', function(err, data) {
        let result = runner.runSync(data, { timeout: 500 });
        runner.saveToFile(path.join(fName + '-result.json'), JSON.stringify(result));
    });
}

