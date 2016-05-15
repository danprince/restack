const test = require('tape');

const createLexer = require('../src/lexer');
const realTypes = require('../src/tokens');
const exampleTypes = [
  { name: 'number', pattern: /^\d+/ },
  { name: 'operator', pattern: /^[\+\-\*\/]/ }
];

test('generic lexer', t => {
  t.plan(8);

  const exampleLexer = createLexer(exampleTypes);
  t.equals(
    'function',
    typeof exampleLexer,
    'createLexer should return a function'
  );

  t.doesNotThrow(
    () => exampleLexer('34 + 56'),
    'should not throw for valid strings'
  );

  t.throws(
    () => exampleLexer('HELLO + world'),
    Error,
    'should throw for invalid strings'
  );

  const exampleTokens = exampleLexer('3 + 5\n - 10');
  t.equals(
    5,
    exampleTokens.length,
    'should lex the correct number of tokens'
  );

  t.deepEquals(
    ['number', 'operator', 'number', 'operator', 'number'],
    exampleTokens.map(token => token.type),
    'should lex the types'
  );

  t.deepEquals(
    ['3', '+', '5', '-', '10'],
    exampleTokens.map(token => token.raw),
    'should lex the correct substrings'
  );

  t.deepEquals(
    [{line: 1, column: 1}, {line: 1, column: 3}, {line: 1, column: 5},
     {line: 2, column: 2}, {line: 2, column: 4}],
    exampleTokens.map(token => token.loc.start),
    'should lex starting positions'
  );

  t.deepEquals(
    [{line: 1, column: 1}, {line: 1, column: 3}, {line: 1, column: 5},
     {line: 2, column: 2}, {line: 2, column: 5}],
    exampleTokens.map(token => token.loc.end),
    'should lex end positions'
  );
});

test('language lexer', t => {
  t.plan(25);

  const lexer = createLexer(realTypes);

  // strings
  t.equals(
    'string',
    lexer('"hello, world"')[0].type,
    'should identify string'
  );

  t.equals(
    '"hello world"',
    lexer('"hello world"')[0].raw,
    'should extract raw string'
  );

  t.notEquals(
    'string',
    lexer('\'hello, world\'')[0].type,
    'should not work with single quotes'
  );

  t.notEquals(
    '"hello, \n world"',
    lexer('"hello,\n world"')[0].raw,
    'should lex multiline strings'
  );

  // numbers
  t.equals(
    'number',
    lexer('234')[0].type,
    'should identify number'
  );

  t.equals(
    '204',
    lexer('204')[0].raw,
    'should extract raw number'
  );

  // comments
  t.equals(
    'comment',
    lexer('--hey')[0].type,
    'should identify comments'
  );

  t.equals(
    1,
    lexer('--hey to square ()').length,
    'should ignore tokens after comments'
  );

  t.equals(
    5,
    lexer('--hey\nto square ()').length,
    'should not ignore tokens on new line after comment'
  );

  t.equals(
    3,
    lexer('hello world --hey').length,
    'should lex comment at the end of a line'
  );

  // brackets
  t.equals(
    'open',
    lexer('(')[0].type,
    'should identify opening bracket'
  );
  t.equals(
    'close',
    lexer(')')[0].type,
    'should identify closing bracket'
  );

  t.notEquals(
    'open',
    lexer('"("')[0].type,
    'should not identify opening bracket in string'
  );
  t.notEquals(
    'open',
    lexer('")"')[0].type,
    'should not identify closing bracket in string'
  );

  t.equals(
    '(',
    lexer('(')[0].raw,
    'should extract raw value for opening bracket'
  );
  t.equals(
    ')',
    lexer(')')[0].raw,
    'should extract raw value for closing bracket'
  );

  //symbols
  t.equals(
    'symbol',
    lexer('hello')[0].type,
    'should identify symbol'
  );

  t.equals(
    'test-symbol',
    lexer('test-symbol')[0].raw,
    'should extract raw value for symbol'
  );

  t.equals(
    'mysym2',
    lexer('mysym2')[0].raw,
    'should support symbols that include numbers'
  );

  t.notEquals(
    '2mysym',
    lexer('2mysym')[0].raw,
    'should not support symbols that start with numbers'
  );

  t.notEquals(
    'symb()l',
    lexer('symb()l')[0].raw,
    'should not support symbols that include parens'
  );

  // examples
  const tokens = lexer(
    `to square (2 *)
2 square`
  );

  t.deepEquals(
    ['symbol', 'symbol', 'open', 'number', 'symbol',
     'close', 'number', 'symbol'],
    tokens.map(token => token.type),
    'should lex token types in example'
  );

  t.deepEquals(
    ['to', 'square', '(', '2', '*', ')', '2', 'square'],
    tokens.map(token => token.raw),
    'should lex raw values in example'
  );

  t.deepEquals(
    [{line: 1, column: 1}, {line: 1, column: 4}, {line: 1, column: 11},
     {line: 1, column: 12}, {line: 1, column: 14}, {line: 1, column: 15},
     {line: 2, column: 1}, {line: 2, column: 3}],
    tokens.map(token => token.loc.start),
    'should lex start positions'
  );

  t.deepEquals(
    [{line: 1, column: 2}, {line: 1, column: 9}, {line: 1, column: 11},
     {line: 1, column: 12}, {line: 1, column: 14}, {line: 1, column: 15},
     {line: 2, column: 1}, {line: 2, column: 8}],
    tokens.map(token => token.loc.end),
    'should lex end positions'
  );

});

