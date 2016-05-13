function condp(f, ...clauses) {
  return function(x) {
    const val = f(x);
    for(let [test, ret] of clauses) {
      if(val == test) return ret();
    }

    throw new Error('Could not match: ' + x);
  }
}

function parse(tokens) {
  function Expression() {
    //console.log('<Expression>');
    const terms = [];
    while(tokens.length) {
      const term = Term();
      terms.push(term);
    }
    return {
      type: 'expression',
      terms: terms
    };
  }

  function Term() {
    //console.log('<Term>');

    const val = condp(
      t => t.type,
      ['symbol', () => tokens.shift()],
      ['open', () => Block()],
      ['string', () => Literal()],
      ['number', () => Literal()],
      ['comment', () => tokens.shift()]
    )(tokens[0]);

    return {
      type: 'term',
      value: val
    };
  }

  function Block() {
    //console.log('<Block>');
    const open = tokens.shift();
    const inner = [];
    let brackets = 1;
    let token;

    while(token = tokens.shift()) {
      if(token.type == 'open') brackets += 1;
      if(token.type == 'close') brackets -= 1;

      if(brackets == 0) {
        return {
          type: 'block',
          expression: parse(inner)
        };
      }

      inner.push(token);
    }

    throw new SyntaxError('Unmatched bracket');
  }

  function Literal() {
    //console.log('<Literal>');
    return {
      type: 'literal',
      value: tokens.shift()
    };
  }

  return Expression();
}

module.exports = parse;

