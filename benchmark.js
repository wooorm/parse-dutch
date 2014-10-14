'use strict';

/**
 * Dependencies.
 */

var ParseDutch;

ParseDutch = require('./');

/**
 * Fixtures.
 *
 * Source:
 *   http://www.gutenberg.org/cache/epub/11024/pg11024.html
 */

var sentence,
    paragraph,
    section,
    article,
    book;

/**
 * A sentence, 20 words.
 */

sentence = 'Mynheer de rechter, daar is de man die ' +
    'Barbertje vermoord heeft die man moet hangen, ' +
    'hoe heeft hy dat aangelegd.';

/**
 * A paragraph, 5 sentences.
 */

paragraph =  'Ik nam het bestuur der natalsche ' +
    'afdeeling over, en myn voorganger vertrok, na ' +
    'eenigen tyd ontving ik bericht dat generaal. ' +

    'Ook te Padang, als een gevangene te zullen ' +
    'aankomen, wèl moet hy dus zeer verwonderd hebben ' +
    'gestaan, by de ontscheping. ' +

    'Dit is dan ook de reden, Verbrugge, waarom ik ' +
    'geen vreemdeling ben in de zaken van Lebak, en ' +
    'dat ik. ' +

    'Met weerzin gaf de Regeeringskommissaris toe, en ' +
    'wel op de herhaalde betuigingen van den generaal ' +
    'dat hy persoonlijk zich tot.' +

    sentence;

/**
 * A section, 10 paragraphs.
 */

section = paragraph + Array(10).join('\n\n' + paragraph);

/**
 * An article, 10 sections.
 */

article = section + Array(10).join('\n\n' + section);

/**
 * An book, 10 articles.
 */

book = article + Array(10).join('\n\n' + article);

/**
 * Benchmarks.
 */

suite('dutch.parse(document);', function () {
    var dutch;

    dutch = new ParseDutch();

    set('mintime', 100);

    bench('A paragraph (5 sentences, 100 words)', function () {
        dutch.parse(paragraph);
    });

    bench('A section (10 paragraphs)', function () {
        dutch.parse(section);
    });

    bench('An article (10 sections)', function () {
        dutch.parse(article);
    });

    bench('A (large) book (10 articles)', function () {
        dutch.parse(book);
    });
});
