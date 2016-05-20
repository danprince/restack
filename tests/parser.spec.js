const test = require('tape');

const createLexer = require('../src/parser/lexer');
const tokens = require('../src/parser/tokens');
const parser = require('../src/parser/parser');
const _ = require('../src/util');

test('parser', t => {
  const lexer = createLexer(tokens);
  const lexAndParse = src => parser(lexer(src));

  t.plan(11);

  // Expression
  t.equals(
    'expression',
    lexAndParse('').type,
    'root node should always be an expression'
  );

  t.equals(
    3,
    lexAndParse('64 "zoo" lane').terms.length,
    'expression should have correct number of terms'
  );

  t.deepEquals(
    ['term', 'term', 'term'],
    lexAndParse('10 66 "zurg"').terms.map(term => term.type),
    'all direct children should be nodes of type term'
  );

  // Term
  t.deepEquals(
    ['literal', 'symbol', 'literal'],
    lexAndParse('4 guys "in led zeppelin"').terms.map(term => term.value.type),
    'should correctly identify types of terms'
  );

  t.equals(
    'symbol',
    lexAndParse('hello-spaceman').terms[0].value.type,
    'should identify symbol'
  );

  t.equals(
    'block',
    lexAndParse('( hello )').terms[0].value.type,
    'should identify blocks'
  );

  t.equals(
    'string',
    lexAndParse('"king in the north"').terms[0].value.value.type,
    'should identify strings'
  );

  t.equals(
    'number',
    lexAndParse('10').terms[0].value.value.type,
    'should identify numbers'
  );

  t.equals(
    'comment',
    lexAndParse('-- what\'s going on').terms[0].value.type,
    'should identify comments'
  );

  // Blocks
  t.throws(
    () => lexAndParse('(2 * ('),
    SyntaxError,
    'should throw for unmatched braces'
  );

  t.doesNotThrow(
    () => lexAndParse('(2 (* 2) map)'),
    'should not throw for nested braces'
  );

});

