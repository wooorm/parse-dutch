'use strict';

/*
 * Dependencies.
 */

var ParseDutch,
    fs;

ParseDutch = require('../');
fs = require('fs');

/*
 * `ParseDutch`.
 */

var dutch;

dutch = new ParseDutch();

/*
 * Exit with info on too-few parameters.
 */

var parameters,
    filepath,
    nlcst;

parameters = process.argv.splice(2);

if (parameters.length < 2) {
    console.log('Usage:');
    console.log('  npm run fixture name document');
    process.exit(1);
}

filepath = 'test/fixture/' + parameters[0] + '.json';
nlcst = dutch.parse(parameters[1]);

/*
 * Write fixture.
 */

fs.writeFileSync(filepath, JSON.stringify(nlcst, 0, 2));

console.log('Wrote file to `' + filepath + '`');
