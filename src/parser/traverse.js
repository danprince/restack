const expansion = require('./transforms/expansion');
const reduction = require('./transforms/reduction');

function traverse(node) {
  return expansion(reduction(node));
}

module.exports = traverse;

