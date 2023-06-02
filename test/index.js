/**
 * @typedef {import('nlcst').Root} Root
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {assert as nlcstTest} from 'nlcst-test'
import {VFile} from 'vfile'
import {ParseDutch} from '../index.js'

const dutch = new ParseDutch()

test('ParseDutch', function () {
  assert.equal(typeof ParseDutch, 'function', 'should be a `function`')

  assert.ok(new ParseDutch() instanceof ParseDutch, 'should instantiate')

  assert.deepEqual(
    new ParseDutch(null, new VFile('Alpha bravo charlie')).parse(),
    dutch.parse('Alpha bravo charlie'),
    'should accept a vfile'
  )
})

test('Abbreviations', async function (t) {
  await t.test('Abbreviations: at sentence end', async function () {
    await describeFixture('abbrev-final', 'Meneer de prof.')
  })

  await t.test(
    'should NOT treat Dutch abbreviations as a terminal marker',
    async function () {
      // Note: This paragraph also tests for coverage of early break branches in
      // the `mergeDutchPrefixExceptions` function.
      // These should probably be tested by running `ParseLatin` specs.
      await describeFixture(
        'abbreviations',
        'St. Augustinus. Enquête! (Herbevestigt). Z. Em. de ' +
          'Hoogwaardige Heer. Een andere zin!'
      )
    }
  )
})

test('Elision', async function (t) {
  await t.test("should treat `'s` as one word", async function () {
    await describeFixture(
      'elision-initial-s',
      "'s-Gravenhage. \u2019s Ochtends!"
    )
  })

  await t.test("should treat `'t` as one word", async function () {
    await describeFixture('elision-initial-t', "'t Kofschip. \u2019t Kofschip!")
  })

  await t.test("should treat `'n` as one word", async function () {
    await describeFixture('elision-initial-n', "'n Liedje. \u2019n Liedje!")
  })

  await t.test("should treat `'ns` as one word", async function () {
    await describeFixture('elision-initial-ns', "Kom 'ns? Kom \u2019ns!")
  })

  await t.test("should treat `'er` as one word", async function () {
    await describeFixture(
      'elision-initial-er',
      "Wanneer heb je 'er voor het laatst gezien?"
    )

    await describeFixture(
      'elision-initial-er-smart',
      'Wanneer heb je \u2019er voor het laatst gezien?'
    )
  })

  await t.test("should treat `'em` as one word", async function () {
    await describeFixture(
      'elision-initial-em',
      "Wanneer heb je 'em voor het laatst gezien?"
    )

    await describeFixture(
      'elision-initial-em-smart',
      'Wanneer heb je \u2019em voor het laatst gezien?'
    )
  })

  await t.test("should treat `'ie` as one word", async function () {
    await describeFixture('elision-initial-ie', "Wat deed 'ie?")

    await describeFixture('elision-initial-ie-smart', 'Wat deed \u2019ie?')
  })

  await t.test("should treat `'tis` as one word", async function () {
    await describeFixture('elision-initial-tis', "'Tis leuk!")

    await describeFixture('elision-initial-tis-smart', '\u2019Tis leuk!')
  })

  await t.test("should treat `'twas` as one word", async function () {
    await describeFixture('elision-initial-twas', "'Twas leuk!")

    await describeFixture('elision-initial-twas-smart', '\u2019Twas leuk!')
  })

  await t.test("should treat `'70s` as one word", async function () {
    await describeFixture('elision-initial-year', "That '70s Show.")

    await describeFixture('elision-initial-year-smart', 'That \u201970s Show.')
  })

  await t.test("should treat `d'` as one word", async function () {
    // Note: This paragraph also tests for coverage of the last branch in the
    // `mergeDutchElisionExceptions` function.
    // These should probably be tested by running `ParseLatin` specs.
    await describeFixture('elision-final-d', "D' eedlen's.")

    await describeFixture('elision-final-d-smart', 'D\u2019 eedlen\u2019s.')
  })

  await t.test(
    'should NOT treat other initial apostrophes as word',
    async function () {
      await describeFixture(
        'elision-non-initial',
        "Bijvoorbeeld iets als 'de voorgaande."
      )

      // This is commented out because `parse-latin` always thinks apostrophes at
      // the start of a word are part of that word.
      // await describeFixture(
      //   'elision-non-initial-smart',
      //   'Bijvoorbeeld iets als \u2019de voorgaande.'
      // )
    }
  )

  await t.test(
    'should NOT treat other final apostrophes as word',
    async function () {
      await describeFixture(
        'elision-non-final',
        "Bijvoorbeeld iets als' de voorgaande."
      )

      await describeFixture(
        'elision-non-final-smart',
        'Bijvoorbeeld iets als\u2019 de voorgaande.'
      )
    }
  )
})

/**
 * Utility to test if a given document is both a valid node, and matches a
 * fixture.
 *
 * @param {string} name
 * @param {string} doc
 * @param {'parse' | 'tokenizeRoot' | 'tokenizeParagraph' | 'tokenizeSentence'} [method='parse']
 * @returns {Promise<void>}
 */
async function describeFixture(name, doc, method) {
  const nlcstA = dutch[method || 'parse'](doc)
  /** @type {Root} */
  const fixture = JSON.parse(
    String(
      await fs.readFile(new URL('fixture/' + name + '.json', import.meta.url))
    )
  )

  nlcstTest(nlcstA)

  assert.deepEqual(nlcstA, fixture, 'should match w/ position')
}
