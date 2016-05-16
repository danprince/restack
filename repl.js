const readline = require('readline');
const chalk = require('chalk');

const tokens = require('./src/tokens');
const createLexer = require('./src/lexer');
const parse = require('./src/parser');
const traverse = require('./src/traverse');
const interpret = require('./src/interpret');
const natives = require('./src/natives');
const _ = require('./src/util');

const package = require('./package.json');

const lex = createLexer(tokens);
const toAST = src => traverse(parse(lex(src)));

const scope = natives;
let stack = [];

const opening = chalk.blue('(');
const closing = chalk.blue(')');

function title() {
  console.log(`r${chalk.magenta('\u2630')}stack REPL`);
  console.log(`Version ${package.version}\n`);
}

function color(a) {
  if(typeof a == 'number') {
    return chalk.yellow(a);
  }
  if(typeof a == 'string') {
    return chalk.green(`"${a}"`);
  }
  if(typeof a == 'object') {
    if(a.type == 'block') {
      return block(a);
    }
    if(a.type == 'symbol') {
      return chalk.blue(a.name);
    }
    return color(a.value);
  }
}

function block(block) {
  const terms = block.expression.terms;
  return [
    chalk.white('('),
    terms.map(color).join(' '),
    chalk.white(')')
  ].join(' ');
}

function prompt(reader, carry='') {
  function onRead(input) {
    const code = carry + input;

    try {
      const ast = toAST(code);
      try {
        stack = interpret(ast, stack, scope);
        console.log(
          opening,
          stack.map(color).join(' '),
          closing
        );
      } catch(ex) {
        console.error(ex);
      } finally {
        prompt(reader, '');
      }
    } catch(ex) {
      return prompt(reader, code);
    }
  }

  if(carry.length == 0) {
    reader.question(chalk.magenta('\u2630 '), onRead);
  } else {
    reader.question(chalk.magenta('.. '), onRead);
  }
}

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

title();
prompt(reader);

