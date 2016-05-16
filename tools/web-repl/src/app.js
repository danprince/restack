var parse = require('./ast');
var createInterpreter = require('./interpreter');
var interpret = createInterpreter();

var repl = document.getElementById('repl');
var rows = document.getElementById('repl-rows');
var input = document.getElementById('repl-input');
var prompt = document.getElementById('repl-prompt');
var stat = document.getElementById('repl-status');
var examples = document.getElementById('examples');

var context = {
  carry: '',
  history: [''],
  cursor: 0
};

var defaultStat = stat.innerHTML;

function createRow() {
  var div = document.createElement('div');
  div.setAttribute('class', 'repl__row');
  return div;
}

function createHistory(status, code) {
  var statusSpan = document.createElement('span');
  statusSpan.innerText = status;
  statusSpan.classList.add('repl__prompt__status');

  var codeInput = document.createElement('input');
  codeInput.setAttribute('type', 'text');
  codeInput.classList.add('repl__prompt__input');
  codeInput.value = code;

  var row = createRow();
  row.classList.add('repl__prompt');
  row.appendChild(statusSpan);
  row.appendChild(codeInput);

  return row;
}

function createResult(stack) {
  var row = createRow();

  var open = taggedSpan('bracket', '(');
  var close = taggedSpan('bracket', ')');
  var terms = stack.map(createTerm);

  row.appendChild(open);
  terms.forEach(function(span) {
    row.appendChild(span);
  });
  row.appendChild(close);

  return row;
}

function taggedSpan(tag, text) {
  var span = document.createElement('span');
  span.innerText = text;
  span.classList.add('tag');
  span.classList.add('tag--' + tag);
  return span;
}

function createTerm(term) {
  if(typeof term == 'string') {
    return taggedSpan('string', '"' + term + '"');
  }
  if(typeof term == 'number') {
    return taggedSpan('number', term);
  }
  if(typeof term == 'boolean') {
    return taggedSpan('boolean', term);
  }
  if(typeof term == 'object') {
    if(term.type == 'block') {
      return createBlock(term);
    }
    if(term.type == 'symbol') {
      if(term.name.startsWith('@')) {
        return taggedSpan('macro', term.name);
      } else {
        return taggedSpan('symbol', term.name);
      }
    }
  }
  return taggedSpan('wut', term.value);
}

function createBlock(block) {
  var container = taggedSpan('block', '');
  var open = taggedSpan('bracket', '(');
  var close = taggedSpan('bracket', ')');
  close.classList.add('no-margin');

  container.appendChild(open);
  block.expression.terms.forEach(function(term) {
    container.appendChild(createTerm(term));
  });
  container.appendChild(close);
  return container;
}

function evaluateREPL() {
  var code = input.value;
  context.history.unshift(code);
  input.value = '';

  var history = createHistory(stat.innerText, ' ' + code);
  rows.appendChild(history);

  try {
    var ast = parse(context.carry + code);
    context.carry = '';

    try {
      var stack = interpret(ast);
      console.log(stack);
      var result = createResult(stack);
      rows.appendChild(result);
    } catch(ex) {
      var error = createRow();
      error.classList.add('error');
      error.innerHTML = ex.toString();
      rows.appendChild(error);
    } finally {
      stat.innerText = defaultStat;
    }
  } catch(ex) {
    // could not parse, switch prompt and continue
    stat.innerText = '..';
    context.carry += ('\n' + code);
  } finally {
    repl.scrollTop = repl.scrollHeight;
  }
}

repl.addEventListener('click', function onREPLClick(e) {
  input.focus();
});

input.addEventListener('keydown', function onREPLPress(e) {
  var isUp = (e.which == 38);
  var isDown = (e.which == 40);
  var isEnter = (e.which == 13);

  if(isUp) {
  }
  else if(isDown) {
  }
  else if(isEnter) {
    evaluateREPL();
  }
});

examples.addEventListener('click', function onExampleClick(e) {
  var code = e.target.getAttribute('data-example');
  if(code !== null) {
    interpret(parse('drop-all'));
    input.value = code;
    evaluateREPL();
  }
});


