const fs = require('fs');
const toAST = require('./to-ast');
const interpret = require('./interpret');
const generator = require('./generate');

function genFile(path) {
  const buffer = fs.readFileSync(path);
  const src = buffer.toString();

  const ast = toAST(src);
  return generator(ast);
}

module.exports = genFile;

