const fs = require('fs');
const createLexer = require('./src/lexer');
const tokenTypes = require('./src/tokens');
const parse = require('./src/parser');
const traverse = require('./src/traverse');
const interpret = require('./src/interpret');

//const pretty = require('./src/pretty');

const path = process.argv[2];
const buffer = fs.readFileSync(path);
const src = buffer.toString();

const lex = createLexer(tokenTypes);
const tokens = lex(src);
const cst = parse(tokens);
const ast = traverse(cst);
const value = interpret(ast);

//console.log('\ncst\n---');
//console.log(pretty.tree(cst));
//console.log('\nast\n---');
//console.log(pretty.tree(ast));
