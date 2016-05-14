const sfx = require('sfx');
const interpret = require('./interpret');

exports['+'] = function add(stack) {
  return [stack.reduce((a, b) => a + b)];
};

exports['-'] = function sub(stack) {
  return [stack.reduce((a, b) => a - b)];
};

// pretend you didn't see these
exports['-='] = function sub(stack) {
  const a = stack.pop();
  const b = stack.pop();
  return [...stack, a - b];
};
exports['+='] = function sub(stack) {
  const a = stack.pop();
  const b = stack.pop();
  return [...stack, a + b];
};

exports['/'] = function div(stack) {
  return [stack.reduce((a, b) => a / b)];
};

exports['*'] = function mul(stack) {
  return [stack.reduce((a, b) => a * b)];
};

exports['<'] = function lt(stack) {
  const [a, b] = [stack.pop(), stack.pop()];
  return [...stack, a < b];
};

exports['<='] = function lte(stack) {
  const [a, b] = [stack.pop(), stack.pop()];
  return [...stack, a <= b];
};

exports['>'] = function gt(stack) {
  const [a, b] = [stack.pop(), stack.pop()];
  return [...stack, a > b];
};

exports['>='] = function gte(stack) {
  const [a, b] = [stack.pop(), stack.pop()];
  return [...stack, a >= b];
};

exports.and = function and(stack) {
  return [stack.reduce((a, b) => a && b)];
};

exports.or = function or(stack) {
  return [stack.reduce((a, b) => a || b)];
};

exports.not = function or(stack) {
  stack.push(!stack.pop());
  return stack;
};

exports.print = function print(stack) {
  const top = stack[stack.length - 1];
  console.log(top);
  return stack.slice(0, -1);
};

exports.show = function show(stack) {
  console.log(stack);
  return stack;
};

exports.dup = function dup(stack) {
  const top = stack[stack.length - 1];
  return [...stack, top];
};

exports.trip = function trip(stack) {
  const top = stack[stack.length - 1];
  return [...stack, top, top];
};

exports.reverse = function reverse(stack) {
  return stack.reverse();
};

exports['number?'] = function isNumber(stack) {
  const top = stack[stack.length - 1];
  if(typeof top != 'number') {
    throw new TypeError('Expected number but got ' + typeof top);
  }
  return stack;
};

exports['string?'] = function isString(stack) {
  const top = stack[stack.length - 1];
  if(typeof top != 'string') {
    throw new TypeError('Expected string but got ' + typeof top);
  }
  return stack;
};

exports['='] = function equals(stack) {
  const [a, b] = [stack.pop(), stack.pop()];
  return [...stack, a === b];
};

exports['if'] = function ifStatement(stack) {
  const elseStatement = stack.pop();
  const ifStatement = stack.pop();
  const cond = stack.pop();

  if(cond) {
    return interpret(ifStatement.expression, stack, this);
  } else {
    return interpret(elseStatement.expression, stack, this);
  }
};

exports.object = function object(stack) {
  const val = stack.pop();
  const key = stack.pop();
  return [...stack, { [key]: val }];
};

exports.split = function split(stack) {
  const on = stack.pop();
  const string = stack.pop();
  return [...stack, ...string.split(on)];
};

exports.join = function join(stack) {
  const delimit = stack.pop();
  return [stack.join(delimit)];
};

exports.times = function times(stack) {
  const n = stack.pop();
  const loop = stack.pop().expression;
  const repetitions = Array.from(Array(n)).map(() => loop);
  return repetitions.reduce((stack, loop) => {
    return stack.concat(interpret(loop, [], this));
  }, stack);
};

exports.range = function range(stack) {
  const end = stack.pop();
  const start = stack.pop();
  const range = [];
  for(let i = start; i < end; i++) {
    range.push(i);
  }
  return [...stack, ...range];
};

exports.map = function map(stack) {
  const mapper = stack.pop().expression;
  return stack.map(val => {
    return interpret(mapper, [val], this)[0];
  });
};

exports['flat-map'] = function flatMap(stack) {
  const mapper = stack.pop().expression;
  return stack.map(val => {
    return interpret(mapper, [val], this);
  })
  .reduce((stack, val) => {
    return stack.concat(val);
  }, []);
};

exports.filter = function filter(stack) {
  const filterer = stack.pop().expression;
  return stack.filter(val => {
    return interpret(filterer, [val], this)[0];
  });
};

exports.fold = function fold(stack) {
  const folder = stack.pop().expression;
  return stack.reduce((acc, val) => {
    return interpret(folder, [acc, val], this)[0];
  });
};

exports.random = function random(stack) {
  const index = Math.floor(Math.random() * stack.length);
  return [stack[index]];
};

exports.drop = function drop(stack) {
  return stack.slice(0, -1);
};

exports.repeat = function repeat(stack) {
  const n = stack.pop();
  const val = stack.pop();
  const repeated = Array.from(Array(n)).map(x => val);
  return stack.concat(repeated);
};

exports.every = function every(stack) {
  return stack.concat([function(action) {
    return function() {
      return action();
    };
  }]);
};

exports.some = function some(stack) {
  return stack.concat([function(action) {
    return function(stack) {
      if(Math.random() > .5) {
        return action();
      } else {
        return stack;
      }
    };
  }]);
};

exports.second = function second(stack) {
  const limiter = stack.pop();
  const action = stack.pop().expression;

  let _stack = stack.map(x => x);
  const execute = limiter(() => {
    _stack = interpret(action, _stack, this);
  });

  setInterval(execute, 1000);

  return stack;
};

exports.seconds = function second(stack) {
  const n = stack.pop();
  const limiter = stack.pop();
  const action = stack.pop().expression;

  let _stack = stack.map(x => x);
  const execute = limiter(() => {
    _stack = interpret(action, _stack, this);
  });

  setInterval(execute, n * 1000);

  return stack;
};

exports.ms = function second(stack) {
  const ms = stack.pop();
  const limiter = stack.pop();
  const action = stack.pop().expression;

  let _stack = stack.map(x => x);
  const execute = limiter(() => {
    _stack = interpret(action, _stack, this);
  });

  setInterval(execute, ms);

  return stack;
};

exports.when = function when(stack) {
  const clause = stack.pop().expression;
  const cond = stack.pop();
  if(cond) {
    return stack.concat(interpret(clause, stack, this));
  } else {
    return stack;
  }
};

exports.swap = function swap(stack) {
  const above = stack.pop();
  const below = stack.pop();
  stack.push(above, below);
  return stack;
};

exports.cycle = function cycle(stack) {
  stack.unshift(stack.pop());
  return stack;
};

exports.play = function play(stack) {
  const path = stack.pop();
  sfx.play(path);
  return stack;
};

