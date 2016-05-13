const _ = require('./grammar-utils');

const grammar = {
  expression: _.rule(['term']).or(['term', 'expression']),
  term: _.rule(['number']).or(['string']).or(['block']),
  block: _.rule(['open', 'expression', 'close'])
};

[
]

{
  expression: [rule('statement'), rule('statement', 'program'),
               rule('expression'), rule('expression', 'program')],
  statement: [rule('macro'), rule('function'), rule('import')],
  expression: [rule('term'), rule('term', 'expression')],
  term: [rule('symbol'), rule('number'), rule('string'), rule('block')],
  block: [rule('(', 'expression', ')')],
  function: [rule('term', '=', 'expression')],
  macro: [rule('term', '@=', 'expression')],
  import: [rule('import', 'block', 'from', 'string']
}
