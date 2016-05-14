module.exports = interpret;
const natives = require('./natives');

function interpret(ast, stack=[], scope=natives) {
  return ast.terms.reduce(evaluate.bind(scope), stack);
}

function evaluate(stack, node) {
  if(node.type == 'func') {
    this[node.name] = function(stack) {
      const { terms } = node.body.expression;
      return terms.reduce(evaluate.bind(this), stack);
    };
    return stack;
  }
  if(node.type == 'macro') {
    this[node.name] = function(stack) {
      const { terms } = node.body.expression;
      const expr = stack.pop().expression;
      const macroed = terms.reduce(evaluate.bind(this), expr.terms);
      const newStack = macroed.reduce(evaluate.bind(this), stack);
      return [...stack, ...newStack];
    };
    return stack;
  }
  else if(node.type == 'number' || node.type == 'string') {
    return [...stack, node.value];
  }
  else if(node.type == 'block') {
    return [...stack, node];
  }
  else if(node.type == 'symbol') {
    if(!this.hasOwnProperty(node.name)) {
      throw new Error(`Could not not find '${node.name}'`);
    }
    return this[node.name](stack);
  }
}


