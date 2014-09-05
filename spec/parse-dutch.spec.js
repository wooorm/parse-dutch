'use strict';

var Parser, assert, parser;

Parser = require('..');
assert = require('assert');
parser = new Parser();

describe('ParseDutch', function () {
    it('should be a function', function () {
        assert(typeof Parser === 'function');
    });

    it('should return a newly initialized `Parser` object, when invoked',
        function () {
            assert(new Parser() instanceof Parser);
            /* eslint-disable new-cap */
            assert(Parser() instanceof Parser);
            /* eslint-enable new-cap */
        }
    );
});

describe('Abbreviations', function () {
    it('should NOT treat Dutch abbreviations as a terminal marker',
        function () {
            /* Note: This paragraph also tests for coverage of early break
             * branches in the `mergeDutchPrefixExceptions` function.
             * These should probably be tested by running ParseLatin
             * specs.
             */
            var root = parser.tokenizeParagraph(
                'St. Augustinus. Enquête! (Herbevestigt). Z. Em. de ' +
                'Hoogwaardige Heer. Een andere zin!'
            ).children[6].children[2];

            assert(JSON.stringify(root) === JSON.stringify({
                'type' : 'WordNode',
                'children' : [
                    {
                        'type' : 'TextNode',
                        'value' : 'Em'
                    },
                    {
                        'type' : 'PunctuationNode',
                        'children' : [
                            {
                                'type' : 'TextNode',
                                'value' : '.'
                            }
                        ]
                    }
                ]
            }));
        }
    );
});

describe('Elision', function () {
    it('should treat `\'s` as one word', function () {
        var root = parser.tokenizeParagraph(
            '\'s-Gravenhage'
        ).children[0].children[0];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 's'
                },
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '-'
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 'Gravenhage'
                }
            ]
        }));
    });

    it('should treat `\'t` as one word', function () {
        var root = parser.tokenizeParagraph(
            '\'t Kofschip'
        ).children[0].children[0];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 't'
                }
            ]
        }));
    });

    it('should treat `\'n` as one word', function () {
        var root = parser.tokenizeParagraph(
            '\'n Liedje'
        ).children[0].children[0];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 'n'
                }
            ]
        }));
    });

    it('should treat `\'ns` as one word', function () {
        var root = parser.tokenizeParagraph(
            'Kom \'ns?'
        ).children[0].children[2];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 'ns'
                }
            ]
        }));
    });

    it('should treat `\'er` as one word', function () {
        var root = parser.tokenizeParagraph(
            'Wanneer heb je \'er voor het laatst gezien?'
        ).children[0].children[6];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 'er'
                }
            ]
        }));
    });

    it('should treat `\'em` as one word', function () {
        var root = parser.tokenizeParagraph(
            'Wanneer heb je \'em voor het laatst gezien?'
        ).children[0].children[6];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 'em'
                }
            ]
        }));
    });

    it('should treat `\'ie` as one word', function () {
        var root = parser.tokenizeParagraph(
            'Wat deed \'ie?'
        ).children[0].children[4];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 'ie'
                }
            ]
        }));
    });

    it('should treat `\'tis` as one word', function () {
        var root = parser.tokenizeParagraph(
            '\'tis leuk!'
        ).children[0].children[0];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 'tis'
                }
            ]
        }));
    });

    it('should treat `\'twas` as one word', function () {
        var root = parser.tokenizeParagraph(
            '\'twas leuk!'
        ).children[0].children[0];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : 'twas'
                }
            ]
        }));
    });

    it('should treat `\'70s` as one word', function () {
        var root = parser.tokenizeParagraph(
            'That \'70s Show.'
        ).children[0].children[2];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'TextNode',
                    'value' : '70s'
                }
            ]
        }));
    });

    it('should treat `d\'` as one word', function () {
        /* Note: This paragraph also tests for coverage of the last branch
         * in the `mergeDutchElisionExceptions` function.
         * These should probably be tested by running ParseLatin
         * specs.
         */
        var root = parser.tokenizeParagraph(
            'd\' eedlen\'s'
        ).children[0].children[0];

        assert(JSON.stringify(root) === JSON.stringify({
            'type' : 'WordNode',
            'children' : [
                {
                    'type' : 'TextNode',
                    'value' : 'd'
                },
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                }
            ]
        }));
    });

    it('should NOT treat other words following an apostrophe, as one word',
        function () {
            var root = parser.tokenizeParagraph(
                'Bijv., a\' ofzo.'
            ).children[0].children;

            assert(JSON.stringify(root) === JSON.stringify([
                {
                    'type' : 'WordNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : 'Bijv'
                        },
                        {
                            'type' : 'PunctuationNode',
                            'children' : [
                                {
                                    'type' : 'TextNode',
                                    'value' : '.'
                                }
                            ]
                        }
                    ]
                },
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : ','
                        }
                    ]
                },
                {
                    'type' : 'WhiteSpaceNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : ' '
                        }
                    ]
                },
                {
                    'type' : 'WordNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : 'a'
                        }
                    ]
                },
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'WhiteSpaceNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : ' '
                        }
                    ]
                },
                {
                    'type' : 'WordNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : 'ofzo'
                        }
                    ]
                },
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '.'
                        }
                    ]
                }
            ]));
        }
    );

    it('should NOT treat other words preceding an apostrophe, as one word',
        function () {
            var root = parser.tokenizeParagraph(
                'Bijv., \'a ofzo.'
            ).children[0].children;

            assert(JSON.stringify(root) === JSON.stringify([
                {
                    'type' : 'WordNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : 'Bijv'
                        },
                        {
                            'type' : 'PunctuationNode',
                            'children' : [
                                {
                                    'type' : 'TextNode',
                                    'value' : '.'
                                }
                            ]
                        }
                    ]
                },
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : ','
                        }
                    ]
                },
                {
                    'type' : 'WhiteSpaceNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : ' '
                        }
                    ]
                },
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '\''
                        }
                    ]
                },
                {
                    'type' : 'WordNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : 'a'
                        }
                    ]
                },
                {
                    'type' : 'WhiteSpaceNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : ' '
                        }
                    ]
                },
                {
                    'type' : 'WordNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : 'ofzo'
                        }
                    ]
                },
                {
                    'type' : 'PunctuationNode',
                    'children' : [
                        {
                            'type' : 'TextNode',
                            'value' : '.'
                        }
                    ]
                }
            ]));
        }
    );
});
