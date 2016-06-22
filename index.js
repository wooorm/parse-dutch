/**
 * @author Titus Wormer
 * @copyright 2014 Titus Wormer
 * @license MIT
 * @module parse-dutch
 * @fileoverview Dutch natural language parser.
 */

'use strict';

/* eslint-env commonjs */

/* Dependencies. */
var Parser = require('parse-latin');
var nlcstToString = require('nlcst-to-string');
var visitChildren = require('unist-util-visit-children');
var modifyChildren = require('unist-util-modify-children');

/* Match a blacklisted (case-insensitive) abbreviation
 * which when followed by a full-stop does not depict
 * a sentence terminal marker. */
var EXPRESSION_ABBREVIATION_DUTCH_PREFIX = new RegExp(
    '^(' +
        /*
         * Business Abbreviations:
         *
         * Incorporation, Limited company.
         */
        'inc|ltd|' +

        /*
         * Abbreviations units and time references:
         * - Note that metric units are almost never
         *   written with a full-stop in Dutch.
         *
         * gram, seconden, minuten, maandag, dinsdag, woensdag, *, donderdag,
         * vrijdag, *, zaterdag, *, zondag.
         * januari, februari, *, maart, april, juni, july, augustus,
         * september, *, oktober, november, december.
         */
        'gr|sec|min|ma|di|wo|woe|do|vr|vrij|za|zat|zo|jan|feb|febr|mrt|' +
        'apr|jun|jul|aug|sep|sept|okt|nov|dec' +

        /*
         * Common abbreviations:
         * - Note that sorting for definitions and
         *   abbreviations is different.
         *
         * Source:
         *   http://nl.wikipedia.org/wiki/Lijst_van_afkortingen_
         *   in_het_Nederlands
         *
         * aanhangsel, aanwijzend (voornaamwoord), (aanwijzend) voornaamwoord,
         * aardewerk, aardrijkskunde, absoluut, abstract, adjunct,
         * administratie, afbeelding, afdeling,
         * afkorting; away from keyboard (term in online gamingwereld),
         * afleiding; aflevering, Afrikaans, afzender, alsjeblieft, alinea,
         * aldaar, algemeen, Amerikaans, ambachtelijk, anatomie,
         * antropologie, bij apothekers, Arabisch, archa\00EFsme,
         * archa\00EFsch,archeologie, artikel, baccalaureus, Blind carbon
         * copy, betreft,bezittelijk (voornaamwoord), bibliotheek, bijlage,
         * bijvoorbeeld,bijzonder, bladzijde, bijvoorbeeld, bijwoord, circa,
         * catalogus, centraal, confer, confer, confer, compagnie,
         * compagnie of compagnon, compagnie of compagnon, cent, decaliter,
         * dergelijke(n), *, de heer, directeur, dividend, doctor, doctoranda,
         * doctorandus, dominee, editie, enzovoort, et alii (en anderen),
         * et cetera, eventueel, eventueel, exclusief, firma, familie,
         * figuur(lijk), florijn (gulden), frank; franco (vrachtvrij),
         * geboren, gebroeders, geheel; gehuwd, gemeente; gemiddeld;
         * gemeubileerd, getekend; getuige, gezang; gezusters, gulden,
         * Hendrikszoon, idem (hetzelfde), inclusief, ingenieur,
         * internationaal, ingenieur, Jonkheer, Jonkvrouw, jongstleden,
         * junior; jaar, Koninklijk (predicaat), kroon, Karaat, laboratorium,
         * licentiaat, lidwoord, laatstleden, luitenant, maximum, maximaal,
         * mejuffrouw, mevrouw, Monseigneur, middag,
         * minimum, minimaal; minister; minuut, miljard, miljoen,
         * meester (in de rechten), meervoud, mevrouw, (Noord-)Brabant,
         * (na) Christus, Nederlands, Nederlands, namelijk, Nederlands,
         * netto, nummer (num\u00E9ro), *, *,  nummers, Nicolaaszoon,
         * obiit (overleden), obligatie,
         * ongeveer; ongenummerd; ongeadresseerd, onovergankelijk (werkwoord),
         * (onovergankelijk) werkwoord, opmerking, oppervlakte,
         * organisatie, over (complicatie), (over) complicatie, pagina,
         * paragraaf, penningmeester, plusminus, plaatsvervangend,
         * president; voorzitter, professor; professioneel (beroeps-),
         * (professor) emeritus, provincie, pseudoniem, (per) stuk,
         * Rechtbank, redactie; redacteur, referenties; referent,
         * verslaggever, respectievelijk, secretaris, sociaal,
         * Latijn: species (soort), Latijn: species (soort),
         * (Fr.) sieur: (de) heer; (Lat.) senior: de oudste; Wetboek van
         * Strafrecht, Stichting; Sint, tabel / tabulator, telefoon, te koop
         * UEdele, uitsluitend, vereniging, vergelijk(ing), voornamelijk,
         * voorzitter, voorzitter, waarnemend, waaronder, werkwoord,
         * zaterdag, (Zijne) Eminentie, zogenaamd, zogenaamd, zoon, zonen
         */
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
);

/* Match a blacklisted word which when followed by
 * an apostrophe depicts elision. */
var EXPRESSION_ELISION_DUTCH_PREFIX = new RegExp(
    '^(' +
        /*
         * Includes:
         *
         * - d' > de.
         */
        'd' +
    ')$'
);

/* Match a blacklisted word which when preceded by
 * an apostrophe depicts elision. */
var EXPRESSION_ELISION_DUTCH_AFFIX = new RegExp(
    '^(' +
        /*
         * Includes:
         *
         * - 'n > een;
         * - 'ns > eens;
         * - 't > het;
         * - 's > des.
         */

        'n|ns|t|s|' +

        /*
         * Includes:
         *
         * - 'er > haar;
         * - 'em > hem;
         * - 'ie > hij;
         * - 'tis > het is;
         * - 'twas > het was.
         */

        'er|em|ie|tis|twas|' +

        /*
         * Matches groups of year, optionally followed
         * by an `s`.
         */

        '\\d\\ds?' +
    ')$'
);

/* Match one apostrophe. */
var EXPRESSION_APOSTROPHE = /^['\u2019]$/;

/**
 * Merge a sentence into its next sentence,
 * when the sentence ends with a certain word.
 *
 * @param {NLCSTNode} child - Node.
 * @param {number} index - Position of `child` in `parent`
 * @param {NLCSTParagraphNode} parent - Parent of `child`.
 * @return {number?} - Next position.
 */
function mergeDutchPrefixExceptions(child, index, parent) {
    var children = child.children;
    var prev;
    var next;
    var node;

    if (
        children &&
        children.length &&
        index !== parent.children.length - 1
    ) {
        prev = children[children.length - 2];
        next = parent.children[index + 1];
        node = children[children.length - 1];

        if (
            node &&
            prev &&
            prev.type === 'WordNode' &&
            nlcstToString(node) === '.' &&
            EXPRESSION_ABBREVIATION_DUTCH_PREFIX.test(
                nlcstToString(prev).toLowerCase()
            )
        ) {
            child.children = children.concat(next.children);

            parent.children.splice(index + 1, 1);

            /* Update position. */
            if (child.position && next.position) {
                child.position.end = next.position.end;
            }

            return index - 1;
        }
    }
}

/**
 * Merge an apostrophe depicting elision into
 * its surrounding word.
 *
 * @param {NLCSTNode} child - Node.
 * @param {number} index - Position of `child` in `parent`
 * @param {NLCSTSentenceNode} parent - Parent of `child`.
 */
function mergeDutchElisionExceptions(child, index, parent) {
    var siblings;
    var length;
    var node;

    if (!EXPRESSION_APOSTROPHE.test(nlcstToString(child))) {
        return;
    }

    siblings = parent.children;
    length = siblings.length;

    /* If a following word exists, and the preceding node
     * is not a word... */
    if (
        index < length - 1 &&
        siblings[index + 1].type === 'WordNode' &&
        (
            index === 0 ||
            siblings[index - 1].type !== 'WordNode'
        )
    ) {
        node = siblings[index + 1];

        if (
            EXPRESSION_ELISION_DUTCH_AFFIX.test(
                nlcstToString(node).toLowerCase()
            )
        ) {
            /* Remove the apostrophe from parent. */
            siblings.splice(index, 1);

            /* Prepend the apostrophe into the children of
             * node. */
            node.children = [child].concat(node.children);

            /* Update position. */
            if (node.position && child.position) {
                node.position.start = child.position.start;
            }
        }
    /* If a preceding word exists, and the following node
     * is not a word... */
    } else if (
        index > 0 &&
        siblings[index - 1].type === 'WordNode' &&
        (
            index === length - 1 ||
            siblings[index + 1].type !== 'WordNode'
        )
    ) {
        node = siblings[index - 1];

        if (
            EXPRESSION_ELISION_DUTCH_PREFIX.test(
                nlcstToString(node).toLowerCase()
            )
        ) {
            /* Remove the apostrophe from parent. */
            siblings.splice(index, 1);

            /* Append the apostrophe into the children of
             * node. */
            node.children.push(child);

            /* Update position. */
            if (node.position && child.position) {
                node.position.end = child.position.end;
            }
        }
    }
}

/**
 * Transform Dutch natural language into an NLCST-tree.
 *
 * @constructor {ParseDutch}
 */
function ParseDutch() {
    if (!(this instanceof ParseDutch)) {
        return new ParseDutch();
    }

    Parser.apply(this, arguments);
}

/* Inherit from `ParseLatin`. */

/**
 * Constructor to create a `ParseDutch` prototype.
 */
function ParserPrototype() {}

ParserPrototype.prototype = Parser.prototype;

var parserPrototype = new ParserPrototype();

ParseDutch.prototype = parserPrototype;

/* Add modifiers to `parser`. */
parserPrototype.tokenizeSentencePlugins =
    [visitChildren(mergeDutchElisionExceptions)].concat(
        parserPrototype.tokenizeSentencePlugins
    );

parserPrototype.tokenizeParagraphPlugins =
    [modifyChildren(mergeDutchPrefixExceptions)].concat(
        parserPrototype.tokenizeParagraphPlugins
    );

/* Expose `ParseLatin.modifier` on `ParseDutch`. */
ParseDutch.modifier = Parser.modifier;

/* Expose `ParseLatin.plugin` on `ParseDutch`. */
ParseDutch.plugin = Parser.plugin;

/* Expose `ParseDutch`. */
module.exports = ParseDutch;
