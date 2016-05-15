// yep this is a hacky interpreter

module.exports = interpret;
const natives = require('./natives');
const _ = require('./util');

function interpret(ast, stack=[], scope=natives) {
  return ast.terms.reduce(evaluate.bind(scope), stack);
}

function evaluate(stack, node) {
  if(!Array.isArray(stack)) {
    throw new TypeError('Stack must be array');
  }

  if(_.isFunction(node)) {
    this[node.name] = function(stack) {
      const { terms } = node.body;
      return terms.reduce(evaluate.bind(this), stack);
    };
    return stack;
  }

  else if(_.isMacro(node)) {
    const macro = node;
    this[macro.name] = function(stack) {
      // terms to re-arrange
      const { terms } = macro.body;
      // function to re-arrange with
      const expr = stack.pop().expression;

      // re-arrange using expr passing the expr as
      // thought it was the stack
      const rearranged = terms.reduce(
        evaluate.bind(this),
        expr.terms
      );

      // evaluate the newly re-arranged function
      const newStack = rearranged.reduce(
        evaluate.bind(this),
        stack
      );

      return [...stack, ...newStack];
    };

    return stack;
  }

  else if(_.isString(node) || _.isNumber(node)) {
    return [...stack, node.value];
  }

  else if(_.isBlock(node) || _.isNumber(node)) {
    return [...stack, node];
  }

  else if(_.isSymbol(node)) {
    if(!this.hasOwnProperty(node.name)) {
      throw new Error(`Could not not find '${node.name}'`);
    }
    return this[node.name](stack);
  }

  else {
    return stack;
  }
}


