// yep this is a hacky interpreter

module.exports = interpret;
const natives = require('./natives');
const _ = require('./util');

function interpret(ast, stack=[], scope=natives) {
  return ast.terms.reduce(evaluate.bind(scope), stack);
}

function evaluate(stack, node) {
  if(_.isFunction(node)) {
    this[node.name] = function(stack) {
      const { terms } = node.body.expression;
      return terms.reduce(evaluate.bind(this), stack);
    };
    return stack;
  }
  else if(_.isMacro(node)) {
    this[node.name] = function(stack) {
      // terms to re-arrange
      const { terms } = node.body.expression;
      // function to re-arrange with
      const expr = stack.pop().expression;

      // re-arrange using expr
      const macroed = terms.reduce(evaluate.bind(this), expr.terms);

      const newStack = macroed.reduce(evaluate.bind(this), stack);
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


