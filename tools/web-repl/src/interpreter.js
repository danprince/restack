var interpret = require('../../../src/interpret');
var natives = require('../../../src/natives');

module.exports = function createInterpreter() {
  var scope = natives;
  var stack = [];

  return function(ast) {
    stack = interpret(ast, stack, scope);
    return stack;
  };
};

