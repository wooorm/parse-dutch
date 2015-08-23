# parse-dutch [![Build Status](https://img.shields.io/travis/wooorm/parse-dutch.svg)](https://travis-ci.org/wooorm/parse-dutch) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/parse-dutch.svg)](https://codecov.io/github/wooorm/parse-dutch)

A Dutch language parser in JavaScript producing [NLCST](https://github.com/wooorm/nlcst)
nodes.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install parse-dutch
```

**parse-dutch** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), and
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and globals
module, [uncompressed](parse-dutch.js) and [compressed](parse-dutch.min.js).

## Usage

```javascript
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
```

## API

**parse-dutch** exposes the same [API as parse-latin](https://github.com/wooorm/parse-latin#api),
but returns results better suited for Dutch natural language.

Additional support includes:

*   Unit and time abbreviations (gr., sec., min., ma., vr., vrij., febr, mrt,
    and more);

*   Lots of abbreviations: (Mr., Mv., Sr., Em., bijv., zgn., amb., and more);

*   Common elision (omission of letters) (d’, ’n, ’ns, ’t, ’s, ’er, ’em, ’ie,
    and more).

## Related

*   [nlcst](https://github.com/wooorm/nlcst)
*   [retext](https://github.com/wooorm/retext)
*   [parse-latin](https://github.com/wooorm/parse-latin)
*   [parse-english](https://github.com/wooorm/parse-english)

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
