'use strict'

var Parser = require('parse-latin')
var toString = require('nlcst-to-string')
var visitChildren = require('unist-util-visit-children')
var modifyChildren = require('unist-util-modify-children')

module.exports = ParseDutch

/* Transform Dutch natural language into an NLCST-tree. */
function ParseDutch(doc, file) {
  if (!(this instanceof ParseDutch)) {
    return new ParseDutch(doc, file)
  }

  Parser.apply(this, arguments)
}

/* Inherit from `ParseLatin`. */

/* Constructor to create a `ParseDutch` prototype. */
function ParserPrototype() {}

ParserPrototype.prototype = Parser.prototype

var parserPrototype = new ParserPrototype()

ParseDutch.prototype = parserPrototype

/* Add modifiers to `parser`. */
parserPrototype.tokenizeSentencePlugins = [
  visitChildren(mergeDutchElisionExceptions)
].concat(parserPrototype.tokenizeSentencePlugins)

parserPrototype.tokenizeParagraphPlugins = [
  modifyChildren(mergeDutchPrefixExceptions)
].concat(parserPrototype.tokenizeParagraphPlugins)

/* Match a blacklisted (case-insensitive) abbreviation
 * which when followed by a full-stop does not depict
 * a sentence terminal marker. */
var ABBREVIATION = new RegExp(
  '^(' +
    /* Business Abbreviations.
     * Incorporation, Limited company. */
    'inc|ltd|' +
    /* Abbreviations units and time references. Note that metric units are
     * almost never written with a full-stop in Dutch.
     * gram, seconden, minuten, maandag, dinsdag, woensdag, *, donderdag,
     * vrijdag, *, zaterdag, *, zondag.
     * januari, februari, *, maart, april, juni, july, augustus,
     * september, *, oktober, november, december. */
    'gr|sec|min|ma|di|wo|woe|do|vr|vrij|za|zat|zo|' +
    'jan|feb|febr|mrt|apr|jun|jul|aug|sep|sept|okt|nov|dec|' +
    /* Common abbreviations:
     * Note that sorting for definitions and
     * abbreviations is different.
     * http://nl.wikipedia.org/wiki/Lijst_van_afkortingen_in_het_Nederlands
     * aanhangsel, aanwijzend (voornaamwoord), (aanwijzend) voornaamwoord,
     * aardewerk, aardrijkskunde, absoluut, abstract, adjunct, administratie,
     * afbeelding, afdeling, afkorting; away from keyboard (term in online
     * gamingwereld), afleiding; aflevering, Afrikaans, afzender, alsjeblieft,
     * alinea, aldaar, algemeen, Amerikaans, ambachtelijk, anatomie,
     * antropologie, bij apothekers, Arabisch, archaïsme, archaïsch,
     * archeologie, artikel, baccalaureus, Blind carbon copy, betreft,
     * bezittelijk (voornaamwoord), bibliotheek, bijlage, bijvoorbeeld,
     * bijzonder, bladzijde, bijvoorbeeld, bijwoord, circa, catalogus,
     * centraal, confer, confer, confer, compagnie, compagnie of compagnon,
     * compagnie of compagnon, cent, decaliter, dergelijke(n), *, de heer,
     * directeur, dividend, doctor, doctoranda, doctorandus, dominee, editie,
     * enzovoort, et alii (en anderen), et cetera, eventueel, eventueel,
     * exclusief, firma, familie, figuur(lijk), florijn (gulden), frank;
     * franco (vrachtvrij), geboren, gebroeders, geheel; gehuwd, gemeente;
     * gemiddeld; gemeubileerd, getekend; getuige, gezang; gezusters, gulden,
     * Hendrikszoon, idem (hetzelfde), inclusief, ingenieur, internationaal,
     * ingenieur, Jonkheer, Jonkvrouw, jongstleden, junior; jaar, Koninklijk
     * (predicaat), kroon, Karaat, laboratorium, licentiaat, lidwoord,
     * laatstleden, luitenant, maximum, maximaal, mejuffrouw, mevrouw,
     * Monseigneur, middag, minimum, minimaal; minister; minuut, miljard,
     * miljoen, meester (in de rechten), meervoud, mevrouw, (Noord-)Brabant,
     * (na) Christus, Nederlands, Nederlands, namelijk, Nederlands, netto,
     * nummer (numéro), *, *,  nummers, Nicolaaszoon, obiit (overleden),
     * obligatie, ongeveer; ongenummerd; ongeadresseerd, onovergankelijk
     * (werkwoord), (onovergankelijk) werkwoord, opmerking, oppervlakte,
     * organisatie, over (complicatie), (over) complicatie, pagina, paragraaf,
     * penningmeester, plusminus, plaatsvervangend, president; voorzitter,
     * professor; professioneel (beroeps-), (professor) emeritus, provincie,
     * pseudoniem, (per) stuk, Rechtbank, redactie; redacteur, referenties;
     * referent, verslaggever, respectievelijk, secretaris, sociaal, Latijn:
     * species (soort), Latijn: species (soort), (Fr.) sieur: (de) heer; (Lat.)
     * senior: de oudste; Wetboek van Strafrecht, Stichting; Sint, tabel /
     * tabulator, telefoon, te koop, uitsluitend, vereniging, vergelijk(ing),
     * voornamelijk, voorzitter, voorzitter, waarnemend, waaronder, werkwoord,
     * zaterdag, (Zijne) Eminentie, zogenaamd, zogenaamd, zoon, zonen */
    'aanh|aanw|aardew|aardr|abs|abstr|adj|adm|afb|afd|afk|afl|afr|afz|' +
    'ajb|al|ald|alg|am|amb|anat|antrop|apoth|ar|arch|archeol|art|bc|' +
    'bcc|betr|bez|bibl|bijl|bijv|bijz|blz|br|bv|bw|ca|cat|centr|cf|cfr|' +
    'chr|cie|cmpl|co|comp|conf|ct|dal|derg|dgl|dhr|dir|div|dr|dra|drs|' +
    'ds|ed|em|enz|et|etc|ev|evt|excl|fa|fam|fig|fl|fr|geb|gebr|geh|' +
    'gem|get|gez|gld|hzn|id|incl|ing|intern|ir|jhr|jkvr|jl|jr|kon|kr|' +
    'kt|lab|lic|ll|lt|lw|max|mej|mevr|mgr|mi|min|mld|mln|mr|mv|mw|ndl|' +
    'ned|nl|no|nr|nro|nrs|nz|ob|obl|ong|onov|opm|opp|org|ov|pag|par|' +
    'penn|plm|plv|pres|prof|prov|pseud|rb|red|ref|resp|secr|soc|sp|' +
    'spec|sr|st|tab|tel|tk|ued|uitsl|ver|vgl|vnl|vnw|voorz|vz|wnd|wo|' +
    'ww|zat|zg|zgn|zn' +
    ')$'
)

/* Match a blacklisted word which when followed by an apostrophe depicts
 * elision. */
var ELISION_PREFIX = new RegExp(
  '^(' +
    /* Includes:
     * - d' > de */
    'd' +
    ')$'
)

/* Match a blacklisted word which when preceded by an apostrophe depicts
 * elision. */
var ELISION_AFFIX = new RegExp(
  '^(' +
    /* Includes:
     * - 'n > een
     * - 'ns > eens
     * - 't > het
     * - 's > des */
    'n|ns|t|s|' +
    /* Includes:
     * - 'er > haar
     * - 'em > hem
     * - 'ie > hij
     * - 'tis > het is
     * - 'twas > het was */
    'er|em|ie|tis|twas|' +
    /* Matches groups of year, optionally followed by an `s`. */
    '\\d\\ds?' +
    ')$'
)

/* Match one apostrophe. */
var APOSTROPHE = /^['\u2019]$/

/* Merge a sentence into its next sentence, when the sentence ends with a
 * certain word. */
function mergeDutchPrefixExceptions(sentence, index, paragraph) {
  var children = sentence.children
  var period = children[children.length - 1]
  var word = children[children.length - 2]
  var next

  if (
    period &&
    toString(period) === '.' &&
    word &&
    word.type === 'WordNode' &&
    ABBREVIATION.test(lower(toString(word)))
  ) {
    /* Merge period into abbreviation. */
    word.children.push(period)
    children.pop()

    if (period.position && word.position) {
      word.position.end = period.position.end
    }

    /* Merge sentences. */
    next = paragraph.children[index + 1]

    if (next) {
      sentence.children = children.concat(next.children)

      paragraph.children.splice(index + 1, 1)

      /* Update position. */
      if (next.position && sentence.position) {
        sentence.position.end = next.position.end
      }

      /* Next, iterate over the current node again. */
      return index - 1
    }
  }
}

/* Merge an apostrophe depicting elision into its surrounding word. */
function mergeDutchElisionExceptions(child, index, sentence) {
  var siblings
  var sibling
  var length

  if (!APOSTROPHE.test(toString(child))) {
    return
  }

  siblings = sentence.children
  length = siblings.length

  /* If a following word exists, and the preceding node is not a word... */
  if (
    index < length - 1 &&
    siblings[index + 1].type === 'WordNode' &&
    (index === 0 || siblings[index - 1].type !== 'WordNode')
  ) {
    sibling = siblings[index + 1]

    if (ELISION_AFFIX.test(lower(toString(sibling)))) {
      /* Remove the apostrophe from the sentence. */
      siblings.splice(index, 1)

      /* Prepend the apostrophe into the children of the sibling. */
      sibling.children = [child].concat(sibling.children)

      /* Update position. */
      if (sibling.position && child.position) {
        sibling.position.start = child.position.start
      }
    }
    /* If a preceding word exists, and the following node is not a word... */
  } else if (
    index > 0 &&
    siblings[index - 1].type === 'WordNode' &&
    (index === length - 1 || siblings[index + 1].type !== 'WordNode')
  ) {
    sibling = siblings[index - 1]

    if (ELISION_PREFIX.test(lower(toString(sibling)))) {
      /* Remove the apostrophe from the sentence. */
      siblings.splice(index, 1)

      /* Append the apostrophe into the children of the sibling. */
      sibling.children.push(child)

      /* Update position. */
      if (sibling.position && child.position) {
        sibling.position.end = child.position.end
      }
    }
  }
}

function lower(value) {
  return value.toLowerCase()
}
