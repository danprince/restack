const expansion = require('./transforms/expansion');
const reduction = require('./transforms/reduction');

function transform(node) {
  return [node]
    .map(reduction)
    .map(expansion)
    .shift();
}

module.exports = transform;

