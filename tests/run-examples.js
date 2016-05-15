const test = require('tape');
const runFile = require('../src/run');

console.log(runFile);

test('run examples', t => {
  const examples = [
    'conditionals.rs', 'filter.rs', 'hello.rs',
    'infix.rs', 'loop.rs', 'macro.rs', 'map.rs', 'types.rs'
  ];

  const paths = examples.map(file => './examples/' + file);

  t.plan(paths.length);

  for(let path of paths) {
    t.doesNotThrow(
      () => runFile(path),
      `should run ${path} example`
    );
  }
});

