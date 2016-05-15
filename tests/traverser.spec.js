const test = require('tape');

const lexer = require('../src/lexer');
const parser = require('../src/parser');
const traverse = require('../src/traverse');

const toAST = src => traverse(parser(lexer(src)));

test('traverse', t => {

});

