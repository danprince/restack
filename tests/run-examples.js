const test = require('tape');
const runFile = require('../src/run');

console.log(runFile);

test('run examples', t => {
  const examples = [
    'conditionals.r_', 'filter.r_', 'hello.r_', 'recur.r_',
    'infix.r_', 'loop.r_', 'macro.r_', 'map.r_'
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

