function identity(x) {
  return x;
}

function typeChecker(type) {
  return function(node) {
    return node.type == type;
  }
}

const isExpression = typeChecker('expression');
const isTerm = typeChecker('term');
const isBlock = typeChecker('block');
const isLiteral = typeChecker('literal');
const isSymbol = typeChecker('symbol');
const isString = typeChecker('string');
const isNumber = typeChecker('number');
const isOpen = typeChecker('open');
const isClose = typeChecker('close');
const isComment = typeChecker('comment');

function expand(node) {
  const terms = node.terms.map(t => t);
  const newTerms = [];

  function Import() {
    const exposes = terms.shift();
    if(!isBlock(exposes)) {
      throw new SyntaxError('Expected block to follow import');
    }

    const from = terms.shift();
    if(!isSymbol(from) && from.name == 'from') {
      throw new SyntaxError('Expected block to follow import');
    }

    const path = terms.shift();
    if(!isString(path)) {
      throw new SyntaxError('Expected a path in import');
    }

    newTerms.push({
      type: 'import',
      path: path.value,
      exposes: exposes.expression.terms
    });
  }

  function Func() {
    const identifier = terms.shift();
    if(!isSymbol(identifier)) {
      throw new SyntaxError('Function name must be symbol');
    }

    const body = terms.shift();
    if(!isBlock(body)) {
      throw new SyntaxError('Function body must be a block');
    }

    newTerms.push({
      type: 'func',
      name: identifier.name,
      body
    });
  }

  function Macro() {
    const identifier = terms.shift();
    if(!isSymbol(identifier)) {
      throw new SyntaxError('Macro name must be symbol');
    }

    const body = terms.shift();
    if(!isBlock(body)) {
      throw new SyntaxError('Macro body must be a block');
    }

    newTerms.push({
      type: 'macro',
      name: identifier.name,
      body
    });
  }

  while(terms.length) {
    const node = terms.shift();

    if(isSymbol(node)) {
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
  if(isExpression(node)) {
    const terms = node.terms;
    node.terms = node.terms.map(simplify);
    return node;
  }
  else if(isTerm(node)) {
    return simplify(node.value);
  }
  else if(isBlock(node)) {
    node.expression = simplify(node.expression);
    return node;
  }
  else if(isLiteral(node)) {
    return simplify(node.value);
  }
  else if(isSymbol(node)) {
    node.name = node.raw;
    return node;
  }
  else if(isNumber(node)) {
    node.value = parseFloat(node.raw);
    return node;
  }
  else if(isString(node)) {
    node.value = node.raw.slice(1, -1);
    return node;
  }

  return node;
}

function traverse(node) {
  return expand(simplify(node));
}

module.exports = traverse;

