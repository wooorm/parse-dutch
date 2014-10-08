'use strict';

/**
 * Dependencies.
 */

var ParseDutch,
    assert,
    nlcstTest,
    chalk,
    diff;

ParseDutch = require('..');
assert = require('assert');
nlcstTest = require('nlcst-test');
chalk = require('chalk');
diff = require('diff');

/**
 * `ParseDutch`.
 */

var dutch;

dutch = new ParseDutch();

/**
 * Utility to test if a given document is both a valid
 * node, and matches a fixture.
 *
 * @param {string} name - Filename of fixture.
 * @param {string} document - Source to validate.
 */

function describeFixture(name, document) {
    var nlcst,
        fixture,
        difference;

    nlcst = dutch.parse(document);

    nlcstTest(nlcst);

    fixture = require('./fixture/' + name);

    try {
        assert(JSON.stringify(nlcst) === JSON.stringify(fixture));
    } catch (exception) {
        /* istanbul ignore next */
        difference = diff.diffLines(
            JSON.stringify(fixture, 0, 2), JSON.stringify(nlcst, 0, 2)
        );

        /* istanbul ignore next */
        difference.forEach(function (change) {
            var colour;

            colour = change.added ?
                'green' :
                change.removed ? 'red' : 'dim';

            process.stderr.write(chalk[colour](change.value));
        });

        /* istanbul ignore next */
        throw exception;
    }
}

/**
 * Tests.
 */

describe('ParseDutch', function () {
    it('should be a `function`', function () {
        assert(typeof ParseDutch === 'function');
    });

    it('should return a new instance object when invoked', function () {
        assert(new ParseDutch() instanceof ParseDutch);
        /* eslint-disable new-cap */
        assert(ParseDutch() instanceof ParseDutch);
        /* eslint-enable new-cap */
    });
});

describe('Abbreviations', function () {
    it('should NOT treat Dutch abbreviations as a terminal marker',
        function () {
            /**
             * Note: This paragraph also tests for
             * coverage of early break branches in the
             * `mergeDutchPrefixExceptions` function.
             *
             * These should probably be tested by running
             * `ParseLatin` specs.
             */

            describeFixture(
                'abbreviations',
                'St. Augustinus. Enquête! (Herbevestigt). Z. Em. de ' +
                'Hoogwaardige Heer. Een andere zin!'
            );
        }
    );
});

describe('Elision', function () {
    it('should treat `\'s` as one word', function () {
        describeFixture(
            'elision-initial-s',
            '\'s-Gravenhage. \u2019s Ochtends!'
        );
    });

    it('should treat `\'t` as one word', function () {
        describeFixture(
            'elision-initial-t',
            '\'t Kofschip. \u2019t Kofschip!'
        );
    });

    it('should treat `\'n` as one word', function () {
        describeFixture(
            'elision-initial-n',
            '\'n Liedje. \u2019n Liedje!'
        );
    });

    it('should treat `\'ns` as one word', function () {
        describeFixture(
            'elision-initial-ns',
            'Kom \'ns? Kom \u2019ns!'
        );
    });

    it('should treat `\'er` as one word', function () {
        describeFixture(
            'elision-initial-er',
            'Wanneer heb je \'er voor het laatst gezien?'
        );

        describeFixture(
            'elision-initial-er-smart',
            'Wanneer heb je \u2019er voor het laatst gezien?'
        );
    });

    it('should treat `\'em` as one word', function () {
        describeFixture(
            'elision-initial-em',
            'Wanneer heb je \'em voor het laatst gezien?'
        );

        describeFixture(
            'elision-initial-em-smart',
            'Wanneer heb je \u2019em voor het laatst gezien?'
        );
    });

    it('should treat `\'ie` as one word', function () {
        describeFixture(
            'elision-initial-ie',
            'Wat deed \'ie?'
        );

        describeFixture(
            'elision-initial-ie-smart',
            'Wat deed \u2019ie?'
        );
    });

    it('should treat `\'tis` as one word', function () {
        describeFixture(
            'elision-initial-tis',
            '\'Tis leuk!'
        );

        describeFixture(
            'elision-initial-tis-smart',
            '\u2019Tis leuk!'
        );
    });

    it('should treat `\'twas` as one word', function () {
        describeFixture(
            'elision-initial-twas',
            '\'Twas leuk!'
        );

        describeFixture(
            'elision-initial-twas-smart',
            '\u2019Twas leuk!'
        );
    });

    it('should treat `\'70s` as one word', function () {
        describeFixture(
            'elision-initial-year',
            'That \'70s Show.'
        );

        describeFixture(
            'elision-initial-year-smart',
            'That \u201970s Show.'
        );
    });

    it('should treat `d\'` as one word', function () {
        /**
         * Note: This paragraph also tests for
         * coverage of the last branch in the
         * `mergeDutchElisionExceptions` function.
         *
         * These should probably be tested by running
         * `ParseLatin` specs.
         */

        describeFixture(
            'elision-final-d',
            'D\' eedlen\'s.'
        );

        describeFixture(
            'elision-final-d-smart',
            'D\u2019 eedlen\u2019s.'
        );
    });

    it('should NOT treat other initial apostrophes as word', function () {
        describeFixture(
            'elision-non-initial',
            'Bijvoorbeeld iets als \'de voorgaande.'
        );

        /**
         * This is commented out because `parse-latin`
         * always thinks apostrophes at the start of
         * a word are part of that word.
         */

        /*
         * describeFixture(
         *     'elision-non-initial-smart',
         *     'Bijvoorbeeld iets als \u2019de voorgaande.'
         * );
         */
    });

    it('should NOT treat other final apostrophes as word', function () {
        describeFixture(
            'elision-non-final',
            'Bijvoorbeeld iets als\' de voorgaande.'
        );

        describeFixture(
            'elision-non-final-smart',
            'Bijvoorbeeld iets als\u2019 de voorgaande.'
        );
    });
});
