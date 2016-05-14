exports.token = function prettyToken(token) {
  return `<${token.type} raw=${token.raw} line=${token.line} col=${token.col}>`;
};

exports.tree = function prettyTree(node, depth=0) {
  const indent = Array.from(Array(depth)).map(() => "  ").join('');

  if(node.type == 'expression') {
    return `${indent}(expression\n${
      node.terms.map(n => prettyTree(n, depth + 1)).join('\n')
    })`;
  }
  else if(node.type == 'term') {
    return `${indent}(term\n${prettyTree(node.value, depth + 1)})`;
  }
  else if(node.type == 'block') {
    return `${indent}(block\n${prettyTree(node.expression, depth + 1)})`;
  }
  else if(node.type == 'literal') {
    return `${indent}(literal\n${prettyTree(node.value, depth + 1)})`;
  }
  else if(node.type == 'string' || node.type == 'number') {
    return `${indent}(${node.type})`;
  }
  else {
    return `${indent}(${node.type})`;
  }
};

