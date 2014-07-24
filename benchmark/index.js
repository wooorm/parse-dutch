'use strict';

var Parser, sentence, paragraph, section, article, book;

Parser = require('..');

/* Test data */

/* Source: http://www.gutenberg.org/cache/epub/11024/pg11024.html */

/* A sentence, 20 words. */
sentence = 'Mynheer de rechter, daar is de man die Barbertje vermoord ' +
    'heeft die man moet hangen, hoe heeft hy dat aangelegd.';

/* A paragraph, 5 sentences, 100 words. */
paragraph =  'Ik nam het bestuur der natalsche afdeeling over, en myn ' +
    'voorganger vertrok, na eenigen tyd ontving ik bericht dat generaal. ' +

    'Ook te Padang, als een gevangene te zullen aankomen, wèl ' +
    'moet hy dus zeer verwonderd hebben gestaan, by de ontscheping. ' +

    'Dit is dan ook de reden, Verbrugge, waarom ik geen ' +
    'vreemdeling ben in de zaken van Lebak, en dat ik. ' +

    'Met weerzin gaf de Regeeringskommissaris toe, en wel op de ' +
    'herhaalde betuigingen van den generaal dat hy persoonlijk zich tot.' +

    sentence;

/* A section, 10 paragraphs, 50 sentences, 1,000 words. */
section = paragraph + Array(10).join('\n\n' + paragraph);

/* An article, 100 paragraphs, 500 sentences, 10,000 words. */
article = section + Array(10).join('\n\n' + section);

/* A book, 1,000 paragraphs, 5,000 sentences, 100,000 words. */
book = article + Array(10).join('\n\n' + article);

/* Benchmarks */
suite('parser.parse(source);', function () {
    var parser = new Parser();

    set('mintime', 100);

    bench('A paragraph (5 sentences, 100 words)', function () {
        parser.parse(paragraph);
    });

    bench('A section (10 paragraphs, 50 sentences, 1,000 words)',
        function () {
            parser.parse(section);
        }
    );

    bench('An article (100 paragraphs, 500 sentences, 10,000 words)',
        function () {
            parser.parse(article);
        }
    );

    bench('A (large) book (1,000 paragraphs, 5,000 sentences, 100,000 words)',
        function () {
            parser.parse(book);
        }
    );
});
