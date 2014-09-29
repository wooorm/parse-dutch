# parse-dutch [![Build Status](https://img.shields.io/travis/wooorm/parse-dutch.svg)](https://travis-ci.org/wooorm/parse-dutch) [![Coverage Status](https://img.shields.io/coveralls/wooorm/parse-dutch.svg)](https://coveralls.io/r/wooorm/parse-dutch?branch=master) [![Code Climate](http://img.shields.io/codeclimate/github/wooorm/parse-dutch.svg)](https://codeclimate.com/github/wooorm/parse-dutch)

**parse-dutch** is an Dutch language parser in JavaScript. NodeJS, and the browser. Based on [parse-latin](https://github.com/wooorm/parse-latin "ParseLatin").

## Installation

NPM:
```sh
$ npm install parse-dutch
```

Component.js:
```sh
$ component install wooorm/parse-dutch
```

## Usage

````js
var Parser = require('parse-dutch'),
    parser = new Parser();

/* parse-latin would fail helplessly at the full-stop following `dhr`,
 * and would erroneously parse the following as two
 * sentences. parse-latin would also fail at the elision (’s). */
parser.tokenizeRoot('Kunt U zich ’s morgens melden bij het afd. hoofd dhr. Venema?');
/*
 * Object
 * ├─ type: "RootNode"
 * └─ children: Array[1]
 *    └─ 0: Object
 *          ├─ type: "ParagraphNode"
 *          └─ children: Array[1]
 *             └─ 0: Object
 *                   ├─ type: "SentenceNode"
 *                   └─ children: Array[26]
 *                      ├─ 0: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "Kunt"
 *                      ├─ 1: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 2: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "U"
 *                      ├─ 3: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 4: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "zich"
 *                      ├─ 5: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 6: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         ├─ 0: Object
 *                      |         |     ├─ type: "PunctuationNode"
 *                      |         |     └─ children: Array[1]
 *                      |         |        └─ 0: Object
 *                      |         |               ├─ type: "TextNode"
 *                      |         |               └─ value: "’"
 *                      |         └─ 1: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "s"
 *                      ├─ 7: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 8: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "morgens"
 *                      ├─ 9: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 10: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "melden"
 *                      ├─ 11: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 12: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "bij"
 *                      ├─ 13: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 14: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "het"
 *                      ├─ 15: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 16: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "afd"
 *                      ├─ 17: Object
 *                      |      ├─ type: "PunctuationNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "."
 *                      ├─ 18: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 19: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "hoofd"
 *                      ├─ 20: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 21: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "dhr"
 *                      ├─ 22: Object
 *                      |      ├─ type: "PunctuationNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "."
 *                      ├─ 23: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: " "
 *                      ├─ 24: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |                ├─ type: "TextNode"
 *                      |                └─ value: "Venema"
 *                      └─ 25: Object
 *                             ├─ type: "PunctuationNode"
 *                             └─ children: Array[1]
 *                                └─ 0: Object
 *                                       ├─ type: "TextNode"
 *                                       └─ value: "?"
 */
````

## API

parse-dutch has the same [API as parse-latin](https://github.com/wooorm/parse-latin#api "ParseLatin API"), but returns results better suited for Dutch natural language.

Support includes:

* Unit and time abbreviations (gr., sec., min., ma., vr., vrij., febr, mrt, &c.);
* Lots of abbreviations: (Mr., Mv., Sr., Em., bijv., zgn., amb., &c.);
* Common elision (omission of letters) (d’, ’n, ’ns, ’t, ’s, ’er, ’em, ’ie, &c.).

## Benchmark

Run the benchmark yourself:

```sh
$ npm run benchmark
```

On a MacBook Air, it parser about 3 large books, 60 big articles, or 6,146 paragraphs per second.

```
              parser.parse(source);
   5,719 op/s » A paragraph (5 sentences, 100 words)
     643 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)
      58 op/s » An article (100 paragraphs, 500 sentences, 10,000 words)
       3 op/s » A (large) book (1,000 paragraphs, 5,000 sentences, 100,000 words)
```

## Related

  * [parse-latin](https://github.com/wooorm/parse-latin "ParseLatin")
  * [parse-english](https://github.com/wooorm/parse-latin "ParseDutch")
  * [retext](https://github.com/wooorm/retext "Retext")
  * [textom](https://github.com/wooorm/textom "TextOM")

## License

MIT © Titus Wormer
