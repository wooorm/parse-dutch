'use strict'

var fs = require('fs')
var path = require('path')
var toString = require('nlcst-to-string')
var negate = require('negate')
var hidden = require('is-hidden')
var ParseDutch = require('..')

var root = path.join('test', 'fixture')
var dutch = new ParseDutch()
var files = fs.readdirSync(root).filter(negate(hidden))
var index = -1
var json
var fn
var nlcst

while (++index < files.length) {
  json = JSON.parse(fs.readFileSync(path.join(root, files[index])))
  fn = 'tokenize' + json.type.slice(0, json.type.indexOf('Node'))

  if (fn === 'tokenizeRoot') {
    fn = 'parse'
  }

  nlcst = dutch[fn](toString(json))

  fs.writeFileSync(
    path.join('test', 'fixture', files[index]),
    JSON.stringify(nlcst, null, 2) + '\n'
  )
}
