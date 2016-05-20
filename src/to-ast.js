const tokenTypes = require('./parser/tokens');
const createLexer = require('./parser/lexer');
const parser = require('./parser/parser');
const transformer = require('./parser/transform');

const lexer = createLexer(tokenTypes);

function toAST(src) {
  const tokens = lexer(src);
  const cst = parser(tokens);
  const ast = transformer(cst);
  return ast;
}

module.exports = toAST;

