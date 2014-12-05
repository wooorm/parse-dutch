# parse-dutch [![Build Status](https://img.shields.io/travis/wooorm/parse-dutch.svg?style=flat)](https://travis-ci.org/wooorm/parse-dutch) [![Coverage Status](https://img.shields.io/coveralls/wooorm/parse-dutch.svg?style=flat)](https://coveralls.io/r/wooorm/parse-dutch?branch=master)

A Dutch language parser in JavaScript producing [NLCST](https://github.com/wooorm/nlcst) nodes.

## Installation

npm:
```sh
$ npm install parse-dutch
```

Component:
```sh
$ component install wooorm/parse-dutch
```

Bower:
```sh
$ bower install parse-dutch
```

## Usage

````js
var ParseDutch = require('parse-dutch'),
    dutch = new ParseDutch();

/* parse-latin would fail helplessly at the full-stop following `dhr`,
 * and would erroneously parse the following as two
 * sentences. parse-latin would also fail at the elision (’s). */
dutch.parse(
    'Kunt U zich ’s morgens melden bij het afd. hoofd dhr. Venema?'
);
/*
 * Object
 * ├─ type: "RootNode"
 * └─ children: Array[1]
 *    └─ 0: Object
 *          ├─ type: "ParagraphNode"
 *          └─ children: Array[1]
 *             └─ 0: Object
 *                   ├─ type: "SentenceNode"
 *                   └─ children: Array[24]
 *                      ├─ 0: Object
 *                      |     ├─ type: "WordNode"
 *                      |     └─ children: Array[1]
 *                      |        └─ 0: Object
 *                      |              ├─ type: "TextNode"
 *                      |              └─ value: "Kunt"
 *                      ├─ 1: Object
 *                      |     ├─ type: "WhiteSpaceNode"
 *                      |     └─ value: " "
 *                      ├─ 2: Object
 *                      |     ├─ type: "WordNode"
 *                      |     └─ children: Array[1]
 *                      |        └─ 0: Object
 *                      |              ├─ type: "TextNode"
 *                      |              └─ value: "U"
 *                      ├─ 3: Object
 *                      |     ├─ type: "WhiteSpaceNode"
 *                      |     └─ value: " "
 *                      ├─ 4: Object
 *                      |     ├─ type: "WordNode"
 *                      |     └─ children: Array[1]
 *                      |        └─ 0: Object
 *                      |              ├─ type: "TextNode"
 *                      |              └─ value: "zich"
 *                      ├─ 5: Object
 *                      |     ├─ type: "WhiteSpaceNode"
 *                      |     └─ value: " "
 *                      ├─ 6: Object
 *                      |     ├─ type: "WordNode"
 *                      |     └─ children: Array[2]
 *                      |        ├─ 0: Object
 *                      |        |     ├─ type: "PunctuationNode"
 *                      |        |     └─ value: "’"
 *                      |        └─ 1: Object
 *                      |              ├─ type: "TextNode"
 *                      |              └─ value: "s"
 *                      ├─ 7: Object
 *                      |     ├─ type: "WhiteSpaceNode"
 *                      |     └─ value: " "
 *                      ├─ 8: Object
 *                      |     ├─ type: "WordNode"
 *                      |     └─ children: Array[1]
 *                      |        └─ 0: Object
 *                      |              ├─ type: "TextNode"
 *                      |              └─ value: "morgens"
 *                      ├─ 9: Object
 *                      |     ├─ type: "WhiteSpaceNode"
 *                      |     └─ value: " "
 *                      ├─ 10: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |               ├─ type: "TextNode"
 *                      |               └─ value: "melden"
 *                      ├─ 11: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ value: " "
 *                      ├─ 12: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |               ├─ type: "TextNode"
 *                      |               └─ value: "bij"
 *                      ├─ 13: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ value: " "
 *                      ├─ 14: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |               ├─ type: "TextNode"
 *                      |               └─ value: "het"
 *                      ├─ 15: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ value: " "
 *                      ├─ 16: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[2]
 *                      |         ├─ 0: Object
 *                      |         |     ├─ type: "TextNode"
 *                      |         |     └─ value: "afd"
 *                      |         └─ 1: Object
 *                      |               ├─ type: "PunctuationNode"
 *                      |               └─ value: "."
 *                      ├─ 17: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ value: " "
 *                      ├─ 18: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |               ├─ type: "TextNode"
 *                      |               └─ value: "hoofd"
 *                      ├─ 19: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ value: " "
 *                      ├─ 20: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[2]
 *                      |         ├─ 0: Object
 *                      |         |     ├─ type: "TextNode"
 *                      |         |     └─ value: "dhr"
 *                      |         └─ 1: Object
 *                      |               ├─ type: "PunctuationNode"
 *                      |               └─ value: "."
 *                      ├─ 21: Object
 *                      |      ├─ type: "WhiteSpaceNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |               ├─ type: "TextNode"
 *                      |               └─ value: " "
 *                      ├─ 22: Object
 *                      |      ├─ type: "WordNode"
 *                      |      └─ children: Array[1]
 *                      |         └─ 0: Object
 *                      |               ├─ type: "TextNode"
 *                      |               └─ value: "Venema"
 *                      └─ 23: Object
 *                             ├─ type: "PunctuationNode"
 *                             └─ value: "?"
 */
````

## API

**parse-dutch** exposes the same [API as parse-latin](https://github.com/wooorm/parse-latin#api), but returns results better suited for Dutch natural language.

Additional support includes:

* Unit and time abbreviations (gr., sec., min., ma., vr., vrij., febr, mrt, and more);
* Lots of abbreviations: (Mr., Mv., Sr., Em., bijv., zgn., amb., and more);
* Common elision (omission of letters) (d’, ’n, ’ns, ’t, ’s, ’er, ’em, ’ie, and more).

## Benchmark

On a MacBook Air, it parser about 2 large books per second.

```
              dutch.parse(document);
  2,103 op/s » A paragraph (5 sentences, 100 words)
    253 op/s » A section (10 paragraphs)
     24 op/s » An article (10 sections)
      2 op/s » A (large) book (10 articles)
```

## Related

- [nlcst](https://github.com/wooorm/nlcst)
- [parse-latin](https://github.com/wooorm/parse-latin)
- [parse-english](https://github.com/wooorm/parse-latin)
- [retext](https://github.com/wooorm/retext)
- [textom](https://github.com/wooorm/textom)

## License

MIT © Titus Wormer
