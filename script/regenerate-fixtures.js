'use strict'

var fs = require('fs')
var path = require('path')
var toString = require('nlcst-to-string')
var negate = require('negate')
var hidden = require('is-hidden')
var ParseDutch = require('..')

var root = path.join('test', 'fixture')
var dutch = new ParseDutch()

fs.readdirSync(root)
  .filter(negate(hidden))
  .forEach(function(name) {
    var doc = fs.readFileSync(path.join(root, name))
    var json = JSON.parse(doc)
    var fn = 'tokenize' + json.type.slice(0, json.type.indexOf('Node'))
    var nlcst

    if (fn === 'tokenizeRoot') {
      fn = 'parse'
    }

    nlcst = dutch[fn](toString(json))
    nlcst = JSON.stringify(nlcst, 0, 2) + '\n'

    fs.writeFileSync('test/fixture/' + name, nlcst)
  })
