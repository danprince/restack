const createLexer = require('./lexer');
const tokenTypes = require('./tokens');
const parse = require('./parser');
const traverse = require('./traverse');
const pretty = require('./pretty');
const interpret = require('./interpret');

const lex = createLexer(tokenTypes);
const tokens = lex(
`
`);

//console.log('\nlex\n---');
//console.log(tokens.map(pretty.token).join('\n'));
const cst = parse(tokens);
//
//console.log('\ncst\n---');
//console.log(pretty.tree(cst));
//
const ast = traverse(cst);
//console.log('\nast\n---');
//console.log(pretty.tree(ast));

const value = interpret(ast);
console.log(value);

