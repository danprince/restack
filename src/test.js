const createLexer = require('./lex');
const tokenTypes = require('./tokens');
const parse = require('./parser');
const traverse = require('./traverse');

const lex = createLexer(tokenTypes);
const tokens = lex(`
import (filter) from "./func"

-- reverses a block as though it was a stack
@flip = reverse`);

console.log('\nlex\n---');
console.log(tokens.map(prettyToken).join('\n'));
const cst = parse(tokens);

console.log('\cst\n---');
console.log(prettyTree(cst));

const ast = traverse(cst);
console.log('\ast\n---');
console.log(prettyTree(ast));


function prettyToken(token) {
  return `<${token.type} raw=${token.raw} line=${token.line} col=${token.col}>`;
}

function prettyTree(node, depth = 0) {
  const indent = Array.from(Array(depth)).map(() => "  ").join('');

  if(node.type == 'expression') {
    return `${indent}<expression>\n${
      node.terms.map(n => prettyTree(n, depth + 1)).join('\n')
    }`
  }
  else if(node.type == 'term') {
    return `${indent}<term>\n${prettyTree(node.value, depth + 1)}`;
  }
  else if(node.type == 'block') {
    return `${indent}<block>\n${prettyTree(node.expression, depth + 1)}`;
  }
  else if(node.type == 'literal') {
    return `${indent}<literal>\n${prettyTree(node.value, depth + 1)}`;
  }
  else {
    return `${indent}<${node.type}> : ${node.raw}`;
  }
}
