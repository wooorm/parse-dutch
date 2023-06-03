/**
 * @typedef {import('nlcst').Paragraph} Paragraph
 * @typedef {import('nlcst').Sentence} Sentence
 */

import {ParseLatin} from 'parse-latin'
import {toString} from 'nlcst-to-string'
import {visitChildren} from 'unist-util-visit-children'
import {modifyChildren} from 'unist-util-modify-children'
import {insensitive, sensitive} from './regex.js'

/**
 * Create a new parser.
 *
 * `ParseDutch` extends `ParseLatin`.
 * See `parse-latin` for API docs.
 */
export class ParseDutch extends ParseLatin {}

/**
 * List of transforms handling a sentence.
 */
ParseDutch.prototype.tokenizeSentencePlugins = [
  visitChildren(mergeDutchElisionExceptions),
  ...ParseLatin.prototype.tokenizeSentencePlugins
]

/**
 * List of transforms handling a paragraph.
 */
ParseDutch.prototype.tokenizeParagraphPlugins = [
  modifyChildren(mergeDutchPrefixExceptions),
  ...ParseLatin.prototype.tokenizeParagraphPlugins
]

// Match a blacklisted word which when followed by an apostrophe depicts
// elision.
const elisionPrefix = new RegExp(
  '^(' +
    // Includes: d' > de
    'd' +
    ')$'
)

// Match a blacklisted word which when preceded by an apostrophe depicts
// elision.
const elisionAffix = new RegExp(
  '^(' +
    // Includes: 'n > een; 'ns > eens; 't > het; 's > des
    'n|ns|t|s|' +
    // Includes: 'er > haar; 'em > hem; 'ie > hij; 'tis > het is;
    // 'twas > het was
    'er|em|ie|tis|twas|' +
    // Matches groups of year, optionally followed by an `s`.
    '\\d\\ds?' +
    ')$'
)

// Match one apostrophe.
const apostrophe = /^['\u2019]$/

/**
 * Merge a sentence into its next sentence, when the sentence ends with a
 * certain word.
 *
 * @type {import('unist-util-modify-children').Modifier<Paragraph>}
 */
function mergeDutchPrefixExceptions(sentence, index, paragraph) {
  if ('children' in sentence && sentence.children) {
    const period = sentence.children[sentence.children.length - 1]
    const word = sentence.children[sentence.children.length - 2]

    if (
      period &&
      period.type === 'PunctuationNode' &&
      toString(period) === '.' &&
      word &&
      word.type === 'WordNode'
    ) {
      const value = toString(word)

      if (sensitive.test(value) || insensitive.test(value.toLowerCase())) {
        // Merge period into abbreviation.
        word.children.push(period)
        sentence.children.pop()

        if (period.position && word.position) {
          word.position.end = period.position.end
        }

        // Merge sentences.
        const next = paragraph.children[index + 1]

        if (next && next.type === 'SentenceNode') {
          sentence.children.push(...next.children)
          paragraph.children.splice(index + 1, 1)

          // Update position.
          // eslint-disable-next-line max-depth
          if (next.position && sentence.position) {
            sentence.position.end = next.position.end
          }

          // Next, iterate over the current node again.
          return index - 1
        }
      }
    }
  }
}

/**
 * Merge an apostrophe depicting elision into its surrounding word.
 *
 * @type {import('unist-util-visit-children').Visitor<Sentence>}
 */
function mergeDutchElisionExceptions(child, index, sentence) {
  if (
    (child.type === 'PunctuationNode' || child.type === 'SymbolNode') &&
    apostrophe.test(toString(child))
  ) {
    const siblings = sentence.children
    const length = siblings.length
    const sibling = siblings[index + 1]

    // If a following word exists, and the preceding node is not a word...
    if (
      index < length - 1 &&
      sibling.type === 'WordNode' &&
      (index === 0 || siblings[index - 1].type !== 'WordNode') &&
      elisionAffix.test(toString(sibling).toLowerCase())
    ) {
      // Remove the apostrophe from the sentence.
      siblings.splice(index, 1)

      // Prepend the apostrophe into the children of node.
      sibling.children.unshift(child)

      // Update position.
      if (sibling.position && child.position) {
        sibling.position.start = child.position.start
      }
      // If a preceding word exists, and the following node is not a word...
    } else {
      const sibling = siblings[index - 1]

      if (
        index > 0 &&
        sibling.type === 'WordNode' &&
        (index === length - 1 || siblings[index + 1].type !== 'WordNode') &&
        elisionPrefix.test(toString(sibling).toLowerCase())
      ) {
        // Remove the apostrophe from the sentence.
        siblings.splice(index, 1)

        // Append the apostrophe into the children of node.
        sibling.children.push(child)

        // Update position.
        if (sibling.position && child.position) {
          sibling.position.end = child.position.end
        }
      }
    }
  }
}
