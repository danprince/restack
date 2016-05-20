var tokens = require('../../../src/parser/tokens');
var createLexer = require('../../../src/parser/lexer');
var parse = require('../../../src/parser/parser');
var transform = require('../../../src/parser/transform');
var lex = createLexer(tokens);

module.exports = src => transform(parse(lex(src)));

