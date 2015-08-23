/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module parse-dutch:script:generate-fixture
 * @fileoverview Generate fixtures for `parse-dutch`.
 */

'use strict';

/* eslint-env node */

/* eslint-disable no-console */

/*
 * Dependencies.
 */

var fs = require('fs');
var ParseDutch = require('..');

/*
 * `ParseDutch`.
 */

var dutch = new ParseDutch({
    'position': true
});

/*
 * Exit with info on too-few parameters.
 */

var parameters = process.argv.splice(2);

if (parameters.length < 2) {
    console.log('Usage:');
    console.log('  npm run fixture name document [method]');
    return;
}

var filePath = 'test/fixture/' + parameters[0] + '.json';
var nlcst = dutch[parameters[2] || 'parse'](parameters[1]);

/*
 * Write fixture.
 */

fs.writeFileSync(filePath, JSON.stringify(nlcst, 0, 2) + '\n');

console.log('Wrote file to `' + filePath + '`');
