'use strict';

var EXPRESSION_ABBREVIATION_DUTCH_PREFIX,
    EXPRESSION_ELISION_DUTCH_AFFIX,
    EXPRESSION_ELISION_DUTCH_PREFIX,
    EXPRESSION_APOSTROPHE,
    Parser, parserPrototype;

Parser = require('parse-latin');

/**
 * A blacklist of full stop characters that should not be treated as
 * terminal sentence markers:
 *
 * A "word" boundry,
 * followed by a case-sensitive abbreviation,
 * followed by full stop.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_ABBREVIATION_DUTCH_PREFIX = new RegExp(
    '^(' +
        /*
         * Business Abbreviations:
         * Incorporation, Limited company.
         */
        'inc|ltd|' +

        /*
         * Abbreviations units and time references:
         *
         * Metric units are almost never written with a full-stop in Dutch,
         * Except for some that occur a lot in daily-use-language, get a dot
         * however.
         *
         * gram, seconden, minuten, maandag, dinsdag, woensdag, *, donderdag,
         * vrijdag, *, zaterdag, *, zondag.
         * januari, februari, *, maart, april, juni, july, augustus,
         * september, *, oktober, november, december.
         */
        'gr|sec|min|ma|di|wo|woe|do|vr|vrij|za|zat|zo|jan|feb|febr|mrt|' +
        'apr|jun|jul|aug|sep|sept|okt|nov|dec' +

        /*
         * http://nl.wikipedia.org/wiki/Lijst_van_afkortingen_
         *   in_het_Nederlands
         *
         * Note: The sorting from definitions and abbreviations might
         * differ.
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

/**
 * Returns the value of all `TextNode` tokens inside a given token.
 *
 * @param {Object} token
 * @return {string} - The stringified token.
 * @global
 * @private
 */
function tokenToString(token) {
    var value = '',
        iterator, children;

    /* istanbul ignore if: TODO, Untestable, will change soon. */
    if (token.value) {
        return token.value;
    }

    iterator = -1;
    children = token.children;

    /* Shortcut: This is pretty common, and a small performance win. */
    /* istanbul ignore else: TODO, Untestable, will change soon. */
    if (children.length === 1 && children[0].type === 'TextNode') {
        return children[0].value;
    }

    /* istanbul ignore next: TODO, Untestable, will change soon. */
    while (children[++iterator]) {
        value += tokenToString(children[iterator]);
    }

    /* istanbul ignore next: TODO, Untestable, will change soon. */
    return value;
}

/**
 * Merges a sentence into its next sentence, when the sentence ends with
 * a certain word.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *     over.
 *
 * @global
 * @private
 */
function mergeDutchPrefixExceptions(child, index, parent) {
    var children = child.children,
        node;

    if (
        !children ||
        !children.length ||
        index === parent.children.length - 1
    ) {
        return;
    }

    node = children[children.length - 1];

    if (
        !node || node.type !== 'PunctuationNode' ||
        tokenToString(node) !== '.'
    ) {
        return;
    }

    node = children[children.length - 2];

    if (!node || node.type !== 'WordNode') {
        return;
    }

    if (!(
        EXPRESSION_ABBREVIATION_DUTCH_PREFIX.test(
            tokenToString(node).toLowerCase()
        )
    )) {
        return;
    }

    child.children = children.concat(
        parent.children[index + 1].children
    );

    parent.children.splice(index + 1, 1);

    return index > 0 ? index - 1 : 0;
}

/**
 * A blacklist of common word-parts preceded by an apostrophe, depicting
 * elision.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_ELISION_DUTCH_AFFIX = new RegExp(
    '^(' +
        /* Elisions of "ee['n]", "ee['ns]", "he['t]", and "de['s]". */
        'n|ns|t|s|' +

        /* Elisions of `haar`: `'er`, `hem`: `'em`, `hij`: `'ie`,
         * `het is`: `'tis`, `het was`: `twas`. */
        'er|em|ie|tis|twas|' +

        /* Groups of years. */
        '\\d\\ds' +
    ')$'
);

/**
 * A blacklist of common word-parts followed by an apostrophe, depicting
 * elision.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_ELISION_DUTCH_PREFIX = new RegExp(
    '^(' +
        /* Elisions of `de`: `[d']`. */
        'd' +
    ')$'
);

/**
 * matches one apostrophe.
 *
 * @global
 * @private
 * @constant
 */
EXPRESSION_APOSTROPHE = /^['\u2019]$/;

/**
 * Merges apostrophes depicting elision into its surrounding word.
 *
 * @param {Object} child
 * @param {number} index
 * @param {Object} parent
 * @return {undefined}
 *
 * @global
 * @private
 */
function mergeDutchElisionExceptions(child, index, parent) {
    var siblings = parent.children,
        length = siblings.length,
        node, value;

    /* Return if the child is not an apostrophe. */
    if (
        child.type !== 'PunctuationNode' ||
        !EXPRESSION_APOSTROPHE.test(tokenToString(child))
    ) {
        return;
    }

    /* If a following word exists, and the preceding node is not a word... */
    if (
        index < length - 1 &&
        siblings[index + 1].type === 'WordNode' && (
            index === 0 ||
            siblings[index - 1].type !== 'WordNode'
        )
    ) {
        node = siblings[index + 1];
        value = tokenToString(node).toLowerCase();

        /* If the following word matches a known elision... */
        if (EXPRESSION_ELISION_DUTCH_AFFIX.test(value)) {
            /* Remove the apostrophe from parent. */
            siblings.splice(index, 1);

            /* Prepend the apostrophe into the children of node. */
            node.children = [child].concat(node.children);
        }

        return;
    }

    /* If a preceding word exists, and the following node is not a word... */
    if (
        index > 0 &&
        siblings[index - 1].type === 'WordNode' && (
            index === length - 1 ||
            siblings[index + 1].type !== 'WordNode'
        )
    ) {
        node = siblings[index - 1];
        value = tokenToString(node).toLowerCase();

        /* If the following word matches a known elision... */
        if (EXPRESSION_ELISION_DUTCH_PREFIX.test(value)) {
            /* Remove the apostrophe from parent. */
            siblings.splice(index, 1);

            /* Prepend the apostrophe into the children of node. */
            node.children.push(child);
        }
    }
}

/**
 * Contains the functions needed to tokenize natural Dutch language into a
 * syntax tree.
 *
 * @constructor
 * @public
 */
function ParseDutch() {
    /*
     * TODO: This should later be removed (when this change bubbles
     * through to dependants)
     */
    if (!(this instanceof ParseDutch)) {
        return new ParseDutch();
    }

    Parser.apply(this, arguments);
}

function ParserPrototype () {}
ParserPrototype.prototype = Parser.prototype;
parserPrototype = new ParserPrototype();
ParseDutch.prototype = parserPrototype;

parserPrototype.tokenizeSentenceModifiers = [
        mergeDutchElisionExceptions
    ].concat(parserPrototype.tokenizeSentenceModifiers);

parserPrototype.tokenizeParagraphModifiers = [
        mergeDutchPrefixExceptions
    ].concat(parserPrototype.tokenizeParagraphModifiers);

module.exports = ParseDutch;
