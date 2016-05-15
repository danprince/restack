const test = require('tape');

const _ = require('../src/util');
const createLexer = require('../src/lexer');
const tokens = require('../src/tokens');
const parser = require('../src/parser');
const traverse = require('../src/traverse');
const lexer = createLexer(tokens);

const toAST = src => traverse(parser(lexer(src)));

test('traverse', t => {
  t.plan(26);

  // reduction step
  t.notEquals(
    'term',
    toAST('1').terms[0].type,
    'should replace term nodes with value'
  );

  t.equals(
    'number',
    toAST('(2)').terms[0].expression.terms[0].type,
    'reduction should work recursively within blocks'
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
  t.equals(
    'import',
    toAST('import (foo) from "./bar"').terms[0].type,
    'should expand import statements'
  );

  t.equals(
    './bar',
    toAST('import (foo) from "./bar"').terms[0].path,
    'should expose the import path as a string'
  );

  t.deepEquals(
    ['foo', 'bar'],
    toAST('import (foo bar) from "./bar"').terms[0].exposes,
    'should expose the imported value names as strings'
  );

  t.throws(
    () => toAST('import foo from "./bar"'),
    SyntaxError,
    'should throw if import is not followed by block'
  );

  t.throws(
    () => toAST('import () notfrom "./bar"'),
    SyntaxError,
    'should throw if from keyword is missing in import'
  );

  t.throws(
    () => toAST('import () from true'),
    SyntaxError,
    'should throw if the import path is not a string'
  );

  t.throws(
    () => toAST('import (foo "bar" 4) from true'),
    SyntaxError,
    'should throw if any imports are not symbols'
  );

  t.equals(
    'func',
    toAST('to square (dup *)').terms[0].type,
    'should expand function statements'
  );

  t.equals(
    'cube',
    toAST('to cube (dup *)').terms[0].name,
    'should expose the function name as a string'
  );

  t.equals(
    'expression',
    toAST('to cube (dup *)').terms[0].body.type,
    'should expose the function body as an expression'
  );

  t.throws(
    () => toAST('to "hello" ()'),
    SyntaxError,
    'should throw if function name is not a symbol'
  );

  t.throws(
    () => toAST('to hello 0'),
    SyntaxError,
    'should throw if function body is not a block'
  );

  t.equals(
    'macro',
    toAST('to @flip (reverse)').terms[0].type,
    'should expand macro statements'
  );

  t.equals(
    '@infix',
    toAST('to @infix (swap)').terms[0].name,
    'should expose the macro name as a string'
  );

  t.equals(
    'expression',
    toAST('to @when (() if)').terms[0].body.type,
    'should expose the macro body as an expression'
  );

  t.throws(
    () => toAST('to @flip "reverse"'),
    SyntaxError,
    'should throw if macro body is not a block'
  );

  t.throws(
    () => toAST('to "@hello" ()'),
    SyntaxError,
    'should throw if macro name is not a symbol'
  );

});

