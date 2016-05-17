var interpret = require('../../../src/interpret');
var natives = require('../../../src/natives');

module.exports = function createInterpreter(overrides) {
  var scope = Object.assign(natives, overrides || {});
  var stack = [];

  return function(ast) {
    stack = interpret(ast, stack, scope);
    return stack;
  };
};

