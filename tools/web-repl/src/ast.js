var tokens = require('../../../src/tokens');
var createLexer = require('../../../src/lexer');
var parse = require('../../../src/parser');
var traverse = require('../../../src/traverse');
var lex = createLexer(tokens);

module.exports = src => traverse(parse(lex(src)));
