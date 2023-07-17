# parse-dutch

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Natural language parser, for the Dutch language, that produces [nlcst][].

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`ParseDutch()`](#parsedutch)
*   [Algorithm](#algorithm)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package exposes a parser that takes Dutch natural language and produces
a syntax tree.

## When should I use this?

If you want to handle Dutch natural language as syntax trees manually, use
this.

Alternatively, you can use the retext plugin [`retext-dutch`][retext-dutch],
which wraps this project to also parse natural language at a higher-level
(easier) abstraction.

For English or most Latin-script languages, you can instead use
[`parse-english`][parse-english] or [`parse-latin`][parse-latin].

## Install

This package is [ESM only][esm].
In Node.js (version 16.0+), install with [npm][]:

```sh
npm install parse-dutch
```

In Deno with [`esm.sh`][esmsh]:

```js
import {ParseDutch} from 'https://esm.sh/parse-dutch@7'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {ParseDutch} from 'https://esm.sh/parse-dutch@7?bundle'
</script>
```

## Use

```js
import {inspect} from 'unist-util-inspect'
import {ParseDutch} from 'parse-dutch'

const tree = new ParseDutch().parse(
  'Kunt U zich ’s morgens melden bij het afd. hoofd dhr. Venema?'
)

console.log(inspect(tree))
```

Yields:

```txt
RootNode[1] (1:1-1:62, 0-61)
└─0 ParagraphNode[1] (1:1-1:62, 0-61)
    └─0 SentenceNode[24] (1:1-1:62, 0-61)
        ├─0  WordNode[1] (1:1-1:5, 0-4)
        │    └─0 TextNode "Kunt" (1:1-1:5, 0-4)
        ├─1  WhiteSpaceNode " " (1:5-1:6, 4-5)
        ├─2  WordNode[1] (1:6-1:7, 5-6)
        │    └─0 TextNode "U" (1:6-1:7, 5-6)
        ├─3  WhiteSpaceNode " " (1:7-1:8, 6-7)
        ├─4  WordNode[1] (1:8-1:12, 7-11)
        │    └─0 TextNode "zich" (1:8-1:12, 7-11)
        ├─5  WhiteSpaceNode " " (1:12-1:13, 11-12)
        ├─6  WordNode[2] (1:13-1:15, 12-14)
        │    ├─0 PunctuationNode "’" (1:13-1:14, 12-13)
        │    └─1 TextNode "s" (1:14-1:15, 13-14)
        ├─7  WhiteSpaceNode " " (1:15-1:16, 14-15)
        ├─8  WordNode[1] (1:16-1:23, 15-22)
        │    └─0 TextNode "morgens" (1:16-1:23, 15-22)
        ├─9  WhiteSpaceNode " " (1:23-1:24, 22-23)
        ├─10 WordNode[1] (1:24-1:30, 23-29)
        │    └─0 TextNode "melden" (1:24-1:30, 23-29)
        ├─11 WhiteSpaceNode " " (1:30-1:31, 29-30)
        ├─12 WordNode[1] (1:31-1:34, 30-33)
        │    └─0 TextNode "bij" (1:31-1:34, 30-33)
        ├─13 WhiteSpaceNode " " (1:34-1:35, 33-34)
        ├─14 WordNode[1] (1:35-1:38, 34-37)
        │    └─0 TextNode "het" (1:35-1:38, 34-37)
        ├─15 WhiteSpaceNode " " (1:38-1:39, 37-38)
        ├─16 WordNode[2] (1:39-1:43, 38-42)
        │    ├─0 TextNode "afd" (1:39-1:42, 38-41)
        │    └─1 PunctuationNode "." (1:42-1:43, 41-42)
        ├─17 WhiteSpaceNode " " (1:43-1:44, 42-43)
        ├─18 WordNode[1] (1:44-1:49, 43-48)
        │    └─0 TextNode "hoofd" (1:44-1:49, 43-48)
        ├─19 WhiteSpaceNode " " (1:49-1:50, 48-49)
        ├─20 WordNode[2] (1:50-1:54, 49-53)
        │    ├─0 TextNode "dhr" (1:50-1:53, 49-52)
        │    └─1 PunctuationNode "." (1:53-1:54, 52-53)
        ├─21 WhiteSpaceNode " " (1:54-1:55, 53-54)
        ├─22 WordNode[1] (1:55-1:61, 54-60)
        │    └─0 TextNode "Venema" (1:55-1:61, 54-60)
        └─23 PunctuationNode "?" (1:61-1:62, 60-61)
```

## API

This package exports the identifier [`ParseDutch`][api-parse-dutch].
There is no default export.

### `ParseDutch()`

Create a new parser.

`ParseDutch` extends `ParseLatin`.
See [`parse-latin`][parse-latin] for API docs.

## Algorithm

All of [`parse-latin`][parse-latin] is included, and the following support for
the Dutch natural language:

*   unit and time abbreviations (`gr.`, `sec.`, `min.`, `ma.`, `vr.`, `vrij.`,
    `febr.`, `mrt.`, and more)
*   lots of abbreviations: (`Mr.`, `Mv.`, `Sr.`, `Em.`, `bijv.`, `zgn.`, `amb.`,
    and more)
*   common elision (omission of letters) (`d’`, `’n`, `’ns`, `’t`, `’s`, `’er`,
    `’em`, `’ie`, and more)

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

Projects maintained by me are compatible with maintained versions of Node.js.

When I cut a new major release, I drop support for unmaintained versions of
Node.
This means I try to keep the current release line, `parse-dutch@^7`, compatible
with Node.js 16.

## Security

This package is safe.

## Related

*   [`parse-latin`](https://github.com/wooorm/parse-latin)
    — Latin-script natural language parser
*   [`parse-english`](https://github.com/wooorm/parse-english)
    — English natural language parser

## Contribute

Yes please!
See [How to Contribute to Open Source][contribute].

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/wooorm/parse-dutch/workflows/main/badge.svg

[build]: https://github.com/wooorm/parse-dutch/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/parse-dutch.svg

[coverage]: https://codecov.io/github/wooorm/parse-dutch

[downloads-badge]: https://img.shields.io/npm/dm/parse-dutch.svg

[downloads]: https://www.npmjs.com/package/parse-dutch

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=parse-dutch

[size]: https://bundlejs.com/?q=parse-dutch

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[contribute]: https://opensource.guide/how-to-contribute/

[license]: license

[author]: https://wooorm.com

[retext-dutch]: https://github.com/retextjs/retext/tree/main/packages/retext-dutch

[nlcst]: https://github.com/syntax-tree/nlcst

[parse-latin]: https://github.com/wooorm/parse-latin

[parse-english]: https://github.com/wooorm/parse-english

[api-parse-dutch]: #parsedutch
