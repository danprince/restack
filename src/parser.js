const _ = require('./util');

/**
 * The parse functon takes an array of tokens and uses them to generate
 * a concrete syntax tree.
 *
 * @param {Array} tokens Tokens presumably generated by the
 * lexer. The parser will mutate this list.
 *
 * @return {Expression} A structured tree of syntax nodes with
 * an `Expression` at the root.
 *
 */
function parse(tokens) {
  function Expression() {
    const terms = [];
    while(tokens.length) {
      const term = Term();
      terms.push(term);
    }

    return _.Expression({ terms });
  }

  function Term() {
    const value = _.condp(
      t => t.type,
      ['symbol', () => tokens.shift()],
      ['open', () => Block()],
      ['string', () => Literal()],
      ['number', () => Literal()],
      ['comment', () => tokens.shift()]
    )(tokens[0]);

    return _.Term({ value });
  }

  function Block() {
    const open = tokens.shift();
    const inner = [];
    let brackets = 1;
    let token;

    while(token = tokens.shift()) {
      if(token.type == 'open') brackets += 1;
      if(token.type == 'close') brackets -= 1;

      if(brackets == 0) {
        const expression = parse(inner);
        return _.Block({ expression });
      }

      inner.push(token);
    }

    throw new SyntaxError('Unmatched bracket');
  }

  function Literal() {
    const value = tokens.shift();
    return _.Literal({ value });
  }

  // Start by parsing a single expression from the
  // token list, then let the expression parser
  // offload the other work to the other sub parsers
  // found in this function.
  return Expression();
}

module.exports = parse;

