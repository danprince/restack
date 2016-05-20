const expansion = require('./transforms/expansion');
const reduction = require('./transforms/reduction');

function traverse(node) {
  return [node]
    .map(reduction)
    .map(expansion)
    .shift();
}

module.exports = traverse;

