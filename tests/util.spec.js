const test = require('tape');
const _ = require('../src/util');

test('util', t => {
  t.plan(14);

  // nodecreator
  t.throws(
    () => _.nodeCreator(),
    TypeError,
    'should throw if called with no arguments'
  );

  t.throws(
    () => _.nodeCreator(true),
    TypeError,
    'should throw if called with non string'
  );

  t.equals(
    'function',
    typeof _.nodeCreator('foo'),
    'should return a factory function'
  );

  t.deepEquals(
    { type: 'foo' },
    _.nodeCreator('foo')(),
    'calling factory with 0-args should return simple node'
  );

  t.deepEquals(
    { type: 'bar', qux: 3 },
    _.nodeCreator('bar')({ qux: 3 }),
    'calling factory with 1-arg should return a node with extra props'
  );

  // typechecker
  t.throws(
    () => _.typeChecker(),
    TypeError,
    'should throw if called with no arguments'
  );

  t.throws(
    () => _.typeChecker(null),
    TypeError,
    'should throw if called with non string'
  );

  t.ok(
    _.typeChecker('foo')({ type: 'foo' }),
    'should return true for node with type: foo'
  );

  t.notOk(
    _.typeChecker('foo')({ type: 'bar' }),
    'should return false for node without type: foo'
  );

  // typechecker + nodecreator
  const exampleName = 'bergazoid';
  t.ok(
    _.typeChecker(exampleName)(_.nodeCreator(exampleName)()),
    'typeChecker and nodeCreator should work together'
  );

  // condp
  t.equals(
    'function',
    typeof _.condp((a, b) => a == b, [1, () => true]),
    'should return a function'
  );

  t.equals(
    true,
    _.condp((a, b) => a == b, [1, () => true], [0, () => false])(1),
    'should select correct clause'
  );

  t.throws(
    () => _.condp((a, b) => a == b)(),
    Error,
    'should throw when no clauses are provided'
  );

  t.throws(
    () => _.condp((a, b) => a == b, [0, () => false])(1),
    'should throw when no clauses are matched'
  );
});

