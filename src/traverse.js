function identity(x) {
  return x;
}

function typeChecker(type) {
  return function(node) {
    return node.type == type;
  }
}

const isExpression = typeChecker('expression');
const isTerm = typeChecker('term');
const isBlock = typeChecker('block');
const isLiteral = typeChecker('literal');
const isString = typeChecker('string');
const isNumber = typeChecker('number');
const isOpen = typeChecker('open');
const isClose = typeChecker('close');
const isComment = typeChecker('comment');

function traverse(node) {
  if(isExpression(node)) {
    node.terms = node.terms.map(traverse);
    return node;
  }
  else if(isTerm(node)) {
    return node.value;
  }
  else if(isBlock(node)) {
    node.expression = traverse(node.expression);
    return node;
  }
  else if(isLiteral(node)) {
    return node.value;
  }

  return node;
}

module.exports = traverse;

