const fs = require('fs');
const createLexer = require('./parser/lexer');
const tokenTypes = require('./parser/tokens');
const parse = require('./parser/parser');
const traverse = require('./parser/traverse');
const interpret = require('./interpret');
const generator = require('./generate');

function genFile(path) {
  const buffer = fs.readFileSync(path);
  const src = buffer.toString();

  const lex = createLexer(tokenTypes);
  const tokens = lex(src);
  const cst = parse(tokens);
  const ast = traverse(cst);
  console.log(generator(ast));
}

module.exports = genFile;

