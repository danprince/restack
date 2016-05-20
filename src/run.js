const fs = require('fs');
const createLexer = require('./parser/lexer');
const tokenTypes = require('./parser/tokens');
const parse = require('./parser/parser');
const traverse = require('./parser/traverse');
const interpret = require('./interpret');
const pretty = require('./pretty');

function runFile(path, debug=false) {
  const buffer = fs.readFileSync(path);
  const src = buffer.toString();

  const lex = createLexer(tokenTypes);
  const tokens = lex(src);
  const cst = parse(tokens);

  if(debug) {
    console.log('\ncst\n---');
    console.log(pretty.tree(cst));
  }

  const ast = traverse(cst);

  if(debug) {
    console.log('\nast\n---');
    console.log(pretty.tree(ast));
  }

  const value = interpret(ast);
}

module.exports = runFile;

