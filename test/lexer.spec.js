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
    'should lex the correct types'
  );

  t.deepEquals(
    ['3', '+', '5', '-', '10'],
    exampleTokens.map(token => token.raw),
    'should lex the correct substrings'
  );

  t.deepEquals(
    [1, 1, 1, 2, 2],
    exampleTokens.map(token => token.line),
    'should correctly lex line numbers'
  );

  t.deepEquals(
    [1, 3, 5, 2, 4],
    exampleTokens.map(token => token.col),
    'should correctly lex column numbers'
  );
});

test('language lexer', t => {
  t.plan(1);

  const lexer = createLexer(realTypes);

  t.doesNotThrow(
    () => lexer('to square (* 2)'),
    'should not throw for valid string'
  );

  t.doesNotThrow(
    () => lexer('\u25b6 square (* 2)'),
    'should not throw for unicode in string'
  );

  t.throw(
    () => lexer('"hello" "'),
    Error,
    'should throw for unbalanced quotes'
  );

  t.throw

});

