const test = require('tape');

const _ = require('../src/util');
const createLexer = require('../src/lexer');
const tokens = require('../src/tokens');
const parser = require('../src/parser');
const traverse = require('../src/traverse');
const lexer = createLexer(tokens);

const toAST = src => traverse(parser(lexer(src)));

test('traverse', t => {
  t.plan(12);

  // simplifcation step
  t.notEquals(
    'term',
    toAST('1').terms[0].type,
    'should replace term nodes with value'
  );

  t.equals(
    'number',
    toAST('(2)').terms[0].expression.terms[0].type,
    'should work simplify recursively within blocks'
  );

  t.equals(
    'number',
    toAST('120').terms[0].type,
    'should replace numeric literal with value node'
  );

  t.equals(
    'string',
    toAST('"hello"').terms[0].type,
    'should replace string literal with value node'
  );

  t.equals(
    'foo',
    toAST('foo').terms[0].name,
    'should add name property to symbol nodes'
  );

  t.equals(
    400.4,
    toAST('400.4').terms[0].value,
    'should parse value for number nodes'
  );

  t.equals(
    'Shrek!',
    toAST('"Shrek!"').terms[0].value,
    'should parse value for string nodes'
  );

  t.equals(
    'number',
    toAST('1 -- hello\n 2').terms[1].type,
    'should remove comment nodes'
  );

  t.equals(
    'number',
    toAST('1 \n---\nhello\n---\n 2').terms[1].type,
    'should remove block comment nodes'
  );

  // expansion step
  t.skip('should expand import statements');
  t.skip('should expand function statements');
  t.skip('should expand macro statements');
});

