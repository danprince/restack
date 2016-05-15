const fs = require('fs');
const createLexer = require('./lexer');
const tokenTypes = require('./tokens');
const parse = require('./parser');
const traverse = require('./traverse');
const interpret = require('./interpret');
const pretty = require('./pretty');

function runFile(path) {
  const buffer = fs.readFileSync(path);
  const src = buffer.toString();

  const lex = createLexer(tokenTypes);
  const tokens = lex(src);
  const cst = parse(tokens);
  console.log('\ncst\n---');
  console.log(pretty.tree(cst));
  const ast = traverse(cst);
  console.log('\nast\n---');
  console.log(pretty.tree(ast));
  const value = interpret(ast);
}

module.exports = runFile;

