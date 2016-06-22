// Dependencies:
var inspect = require('unist-util-inspect');
var Dutch = require('./index.js');

// Parse:
var tree = new Dutch().parse(
    'Kunt U zich ’s morgens melden bij het afd. hoofd dhr. Venema?'
);

// Which, when inspecting, yields:
console.log('txt', inspect.noColor(tree));
