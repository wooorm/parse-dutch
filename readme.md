# parse-dutch [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov] [![Chat][chat-badge]][chat]

Dutch language parser for [**retext**][retext] producing
[**NLCST**][nlcst] nodes.

## Installation

[npm][]:

```bash
npm install parse-dutch
```

## Usage

```javascript
var inspect = require('unist-util-inspect');
var Dutch = require('parse-dutch');

var tree = new Dutch().parse('Kunt U zich ’s morgens melden bij het afd. hoofd dhr. Venema?');

console.log(inspect(tree));
```

Yields:

```txt
RootNode[1] (1:1-1:62, 0-61)
└─ ParagraphNode[1] (1:1-1:62, 0-61)
   └─ SentenceNode[24] (1:1-1:62, 0-61)
      ├─ WordNode[1] (1:1-1:5, 0-4)
      │  └─ TextNode: "Kunt" (1:1-1:5, 0-4)
      ├─ WhiteSpaceNode: " " (1:5-1:6, 4-5)
      ├─ WordNode[1] (1:6-1:7, 5-6)
      │  └─ TextNode: "U" (1:6-1:7, 5-6)
      ├─ WhiteSpaceNode: " " (1:7-1:8, 6-7)
      ├─ WordNode[1] (1:8-1:12, 7-11)
      │  └─ TextNode: "zich" (1:8-1:12, 7-11)
      ├─ WhiteSpaceNode: " " (1:12-1:13, 11-12)
      ├─ WordNode[2] (1:13-1:15, 12-14)
      │  ├─ PunctuationNode: "’" (1:13-1:14, 12-13)
      │  └─ TextNode: "s" (1:14-1:15, 13-14)
      ├─ WhiteSpaceNode: " " (1:15-1:16, 14-15)
      ├─ WordNode[1] (1:16-1:23, 15-22)
      │  └─ TextNode: "morgens" (1:16-1:23, 15-22)
      ├─ WhiteSpaceNode: " " (1:23-1:24, 22-23)
      ├─ WordNode[1] (1:24-1:30, 23-29)
      │  └─ TextNode: "melden" (1:24-1:30, 23-29)
      ├─ WhiteSpaceNode: " " (1:30-1:31, 29-30)
      ├─ WordNode[1] (1:31-1:34, 30-33)
      │  └─ TextNode: "bij" (1:31-1:34, 30-33)
      ├─ WhiteSpaceNode: " " (1:34-1:35, 33-34)
      ├─ WordNode[1] (1:35-1:38, 34-37)
      │  └─ TextNode: "het" (1:35-1:38, 34-37)
      ├─ WhiteSpaceNode: " " (1:38-1:39, 37-38)
      ├─ WordNode[2] (1:39-1:43, 38-42)
      │  ├─ TextNode: "afd" (1:39-1:42, 38-41)
      │  └─ PunctuationNode: "." (1:42-1:43, 41-42)
      ├─ WhiteSpaceNode: " " (1:43-1:44, 42-43)
      ├─ WordNode[1] (1:44-1:49, 43-48)
      │  └─ TextNode: "hoofd" (1:44-1:49, 43-48)
      ├─ WhiteSpaceNode: " " (1:49-1:50, 48-49)
      ├─ WordNode[2] (1:50-1:54, 49-53)
      │  ├─ TextNode: "dhr" (1:50-1:53, 49-52)
      │  └─ PunctuationNode: "." (1:53-1:54, 52-53)
      ├─ WhiteSpaceNode: " " (1:54-1:55, 53-54)
      ├─ WordNode[1] (1:55-1:61, 54-60)
      │  └─ TextNode: "Venema" (1:55-1:61, 54-60)
      └─ PunctuationNode: "?" (1:61-1:62, 60-61)
```

## API

**parse-dutch** exposes [the same API as **parse-latin**][latin].

## Algorithm

All of [**parse-latin**][latin] is included, and the following support
for the Dutch natural language:

*   Unit and time abbreviations (`gr.`, `sec.`, `min.`, `ma.`, `vr.`, `vrij.`,
    `febr.`, `mrt.`, and more);
*   Lots of abbreviations: (`Mr.`, `Mv.`, `Sr.`, `Em.`, `bijv.`, `zgn.`, `amb.`,
    and more);
*   Common elision (omission of letters) (`d’`, `’n`, `’ns`, `’t`, `’s`, `’er`,
    `’em`, `’ie`, and more).

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/parse-dutch.svg

[travis]: https://travis-ci.org/wooorm/parse-dutch

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/parse-dutch.svg

[codecov]: https://codecov.io/github/wooorm/parse-dutch

[chat-badge]: https://img.shields.io/gitter/room/wooorm/retext.svg

[chat]: https://gitter.im/wooorm/retext

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[retext]: https://github.com/wooorm/retext

[nlcst]: https://github.com/wooorm/nlcst

[latin]: https://github.com/wooorm/parse-latin
