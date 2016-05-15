const test = require('tape');

const _ = require('../src/util');
const lexer = require('../src/lexer');
const parser = require('../src/parser');
const traverse = require('../src/traverse');

const toAST = src => traverse(parser(lexer(src)));

test('traverse', t => {
  // simplifcation step
  t.skip('should replace term nodes');
  t.skip('should work recursively with blocks');
  t.skip('should replace literal nodes');
  t.skip('should add name prop to symbol nodes');
  t.skip('should add parse number nodes');
  t.skip('should add parse string nodes');
  t.skip('should remove comment nodes');
  t.skip('should remove block comment nodes');

  // expansion step
  t.skip('should expand import statements');
  t.skip('should expand function statements');
  t.skip('should expand macro statements');
});

