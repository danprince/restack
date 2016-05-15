const _ = require('./util');

function expand(node) {
  const terms = node.terms.map(t => t);
  const newTerms = [];

  function Import() {
    const exposes = terms.shift();
    if(!_.isBlock(exposes)) {
      throw new SyntaxError('Expected block to follow import');
    }

    const from = terms.shift();
    if(!_.isSymbol(from) && from.name == 'from') {
      throw new SyntaxError('Expected block to follow import');
    }

    const path = terms.shift();
    if(!_.isString(path)) {
      throw new SyntaxError('Expected a path in import');
    }

    const node = _.Import({
      path: path.value,
      exposes: exposes.expression.terms
    });

    newTerms.push(node);
  }

  function Func() {
    const identifier = terms.shift();

    if(!_.isSymbol(identifier)) {
      throw new SyntaxError('Function name must be symbol');
    }

    const body = terms.shift();
    if(!_.isBlock(body)) {
      throw new SyntaxError('Function body must be a block');
    }

    const node = _.Function({
      name: identifier.name,
      body
    });

    newTerms.push(node);
  }

  function Macro() {
    const identifier = terms.shift();
    if(!_.isSymbol(identifier)) {
      throw new SyntaxError('Macro name must be symbol');
    }

    const body = terms.shift();
    if(!_.isBlock(body)) {
      throw new SyntaxError('Macro body must be a block');
    }

    const node = _.Macro({
      name: identifier.name,
      body
    });

    newTerms.push(node);
  }

  while(terms.length) {
    const node = terms.shift();

    if(_.isSymbol(node)) {
      if(node.raw == 'import') {
        Import();
        continue;
      }
      if(node.raw == 'to') {
        const identifier = terms[0];
        if(identifier.name.startsWith('@')) {
          Macro();
        } else {
          Func();
        }
        continue;
      }
    }

    newTerms.push(node);
  }

  node.terms = newTerms;
  return node;
}

function simplify(node) {
  if(_.isExpression(node)) {
    const terms = node.terms;
    node.terms = node.terms.map(simplify).filter(n => n !== null);
    return node;
  }
  else if(_.isTerm(node)) {
    return simplify(node.value);
  }
  else if(_.isBlock(node)) {
    node.expression = simplify(node.expression);
    return node;
  }
  else if(_.isLiteral(node)) {
    return simplify(node.value);
  }
  else if(_.isSymbol(node)) {
    node.name = node.raw;
    return node;
  }
  else if(_.isNumber(node)) {
    node.value = parseFloat(node.raw);
    return node;
  }
  else if(_.isString(node)) {
    node.value = node.raw.slice(1, -1);
    return node;
  }
  else if(_.isComment(node)) {
    return null;
  }
  else if(_.isBlockComment(node)) {
    return null;
  }

  return node;
}

function traverse(node) {
  return expand(simplify(node));
}

module.exports = traverse;

