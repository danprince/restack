const _ = require('./util');

/**
 * Takes an expression node (presumably from the root of the CST
 * generated by parse) iterates over it to generate higher level
 * nodes.
 *
 * Importantly this function won't recurse, so it can only be
 * used to expand top level statements like `to` and `import`.
 *
 * @param {Node} expression The root node for the syntax tree
 * that should be expanded.
 *
 * @return {Node} The expanded syntax node.
 */
function expansion(expression) {
  const terms = expression.terms.map(t => t);
  const newTerms = [];

  function Import() {
    const exposes = terms.shift();
    if(!_.isBlock(exposes)) {
      throw new SyntaxError('Expected block to follow import');
    }

    const from = terms.shift();
    if(!_.isSymbol(from) || from.name !== 'from') {
      throw new SyntaxError('Import is missing from statement');
    }

    const path = terms.shift();
    if(!_.isString(path)) {
      throw new SyntaxError('Expected a path in import');
    }

    const names = exposes.expression.terms.map(symbol => {
      if(!_.isSymbol(symbol)) {
        throw new SyntaxError('Expected all imports to be symbols');
      }

      return symbol.name;
    });

    const node = _.Import({
      path: path.value,
      exposes: names
    });

    newTerms.push(node);
  }

  function Func() {
    const identifier = terms.shift();

    const body = terms.shift();
    if(!_.isBlock(body)) {
      throw new SyntaxError('Function body must be a block');
    }

    const node = _.Function({
      name: identifier.name,
      body: body.expression
    });

    newTerms.push(node);
  }

  function Macro() {
    const identifier = terms.shift();

    const body = terms.shift();
    if(!_.isBlock(body)) {
      throw new SyntaxError('Macro body must be a block');
    }

    const node = _.Macro({
      name: identifier.name,
      body: body.expression
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
        if(!_.isSymbol(identifier)) {
          throw new SyntaxError('to must be followed by a symbol');
        }

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

  expression.terms = newTerms;
  return expression;
}

/**
 * Takes an expression node (presumably from the root of the CST
 * generated by parse) iterates over it to remove intemediary
 * syntax nodes.
 *
 * This function recurses down the tree, so it can be used to
 * remove/replace nodes at any depth.
 *
 * @param {Node} expression The root node for the syntax tree
 * that should be reduced.
 *
 * @return {Node} The reduced syntax node.
 */
function reduction(node) {
  if(_.isExpression(node)) {
    const terms = node.terms;
    node.terms = node.terms.map(reduction).filter(n => n !== null);
    return node;
  }
  else if(_.isTerm(node)) {
    return reduction(node.value);
  }
  else if(_.isBlock(node)) {
    node.expression = reduction(node.expression);
    return node;
  }
  else if(_.isLiteral(node)) {
    // drop the literal node and instead
    // return its inner value
    return reduction(node.value);
  }
  else if(_.isSymbol(node)) {
    // make a symbol.name property
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
  return expansion(reduction(node));
}

module.exports = traverse;

