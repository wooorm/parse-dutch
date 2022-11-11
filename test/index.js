import fs from 'node:fs'
import path from 'node:path'
import test from 'tape'
import {assert as nlcstTest} from 'nlcst-test'
import {VFile} from 'vfile'
import {ParseDutch} from '../index.js'

const dutch = new ParseDutch()

test('ParseDutch', function (t) {
  t.equal(typeof ParseDutch, 'function', 'should be a `function`')

  t.ok(new ParseDutch() instanceof ParseDutch, 'should instantiate')

  t.deepLooseEqual(
    new ParseDutch(null, new VFile('Alpha bravo charlie')).parse(),
    dutch.parse('Alpha bravo charlie'),
    'should accept a vfile'
  )

  t.end()
})

test('Abbreviations', function (t) {
  t.test('Abbreviations: at sentence end', function (st) {
    describeFixture(st, 'abbrev-final', 'Meneer de prof.')
    st.end()
  })

  t.test(
    'should NOT treat Dutch abbreviations as a terminal marker',
    function (st) {
      // Note: This paragraph also tests for coverage of early break branches in
      // the `mergeDutchPrefixExceptions` function.
      // These should probably be tested by running `ParseLatin` specs.
      describeFixture(
        st,
        'abbreviations',
        'St. Augustinus. Enquête! (Herbevestigt). Z. Em. de ' +
          'Hoogwaardige Heer. Een andere zin!'
      )

      st.end()
    }
  )

  t.end()
})

test('Elision', function (t) {
  t.test("should treat `'s` as one word", function (st) {
    describeFixture(st, 'elision-initial-s', "'s-Gravenhage. \u2019s Ochtends!")

    st.end()
  })

  t.test("should treat `'t` as one word", function (st) {
    describeFixture(st, 'elision-initial-t', "'t Kofschip. \u2019t Kofschip!")

    st.end()
  })

  t.test("should treat `'n` as one word", function (st) {
    describeFixture(st, 'elision-initial-n', "'n Liedje. \u2019n Liedje!")

    st.end()
  })

  t.test("should treat `'ns` as one word", function (st) {
    describeFixture(st, 'elision-initial-ns', "Kom 'ns? Kom \u2019ns!")

    st.end()
  })

  t.test("should treat `'er` as one word", function (st) {
    describeFixture(
      st,
      'elision-initial-er',
      "Wanneer heb je 'er voor het laatst gezien?"
    )

    describeFixture(
      st,
      'elision-initial-er-smart',
      'Wanneer heb je \u2019er voor het laatst gezien?'
    )

    st.end()
  })

  t.test("should treat `'em` as one word", function (st) {
    describeFixture(
      st,
      'elision-initial-em',
      "Wanneer heb je 'em voor het laatst gezien?"
    )

    describeFixture(
      st,
      'elision-initial-em-smart',
      'Wanneer heb je \u2019em voor het laatst gezien?'
    )

    st.end()
  })

  t.test("should treat `'ie` as one word", function (st) {
    describeFixture(st, 'elision-initial-ie', "Wat deed 'ie?")

    describeFixture(st, 'elision-initial-ie-smart', 'Wat deed \u2019ie?')

    st.end()
  })

  t.test("should treat `'tis` as one word", function (st) {
    describeFixture(st, 'elision-initial-tis', "'Tis leuk!")

    describeFixture(st, 'elision-initial-tis-smart', '\u2019Tis leuk!')

    st.end()
  })

  t.test("should treat `'twas` as one word", function (st) {
    describeFixture(st, 'elision-initial-twas', "'Twas leuk!")

    describeFixture(st, 'elision-initial-twas-smart', '\u2019Twas leuk!')

    st.end()
  })

  t.test("should treat `'70s` as one word", function (st) {
    describeFixture(st, 'elision-initial-year', "That '70s Show.")

    describeFixture(st, 'elision-initial-year-smart', 'That \u201970s Show.')

    st.end()
  })

  t.test("should treat `d'` as one word", function (st) {
    // Note: This paragraph also tests for coverage of the last branch in the
    // `mergeDutchElisionExceptions` function.
    // These should probably be tested by running `ParseLatin` specs.
    describeFixture(st, 'elision-final-d', "D' eedlen's.")

    describeFixture(st, 'elision-final-d-smart', 'D\u2019 eedlen\u2019s.')

    st.end()
  })

  t.test('should NOT treat other initial apostrophes as word', function (st) {
    describeFixture(
      st,
      'elision-non-initial',
      "Bijvoorbeeld iets als 'de voorgaande."
    )

    // This is commented out because `parse-latin` always thinks apostrophes at
    // the start of a word are part of that word.
    // describeFixture(
    //   'elision-non-initial-smart',
    //   'Bijvoorbeeld iets als \u2019de voorgaande.'
    // )

    st.end()
  })

  t.test('should NOT treat other final apostrophes as word', function (st) {
    describeFixture(
      st,
      'elision-non-final',
      "Bijvoorbeeld iets als' de voorgaande."
    )

    describeFixture(
      st,
      'elision-non-final-smart',
      'Bijvoorbeeld iets als\u2019 de voorgaande.'
    )

    st.end()
  })

  t.end()
})

// Utility to test if a given document is both a valid node, and matches a
// fixture.
function describeFixture(t, name, doc, method) {
  const nlcstA = dutch[method || 'parse'](doc)
  const fixture = JSON.parse(
    fs.readFileSync(path.join('test', 'fixture', name + '.json'))
  )

  nlcstTest(nlcstA)

  t.deepLooseEqual(nlcstA, fixture, 'should match w/ position')
}
