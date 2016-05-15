function typeChecker(type) {
  return function(node) {
    return node.type == type;
  }
}

function nodeCreator(type) {
  return function(props={}) {
    return Object.assign({
      type: type,
    }, props);
  };
}

exports.typeChecker = typeChecker;
exports.nodeCreator = nodeCreator;

exports.isExpression = typeChecker('expression');
exports.Expression = nodeCreator('expression');

exports.isTerm = typeChecker('term');
exports.Term = nodeCreator('term');

exports.isBlock = typeChecker('block');
exports.Block = nodeCreator('block');

exports.isLiteral = typeChecker('literal');
exports.Literal = nodeCreator('literal');

exports.isSymbol = typeChecker('symbol');
exports.Symbol = nodeCreator('symbol');

exports.isString = typeChecker('string');
exports.String = nodeCreator('string');

exports.isNumber = typeChecker('number');
exports.Number = nodeCreator('number');

exports.isOpen = typeChecker('open');
exports.Open = nodeCreator('open');

exports.isClose = typeChecker('close');
exports.Close = nodeCreator('close');

exports.isComment = typeChecker('comment');
exports.Comment = nodeCreator('comment');

exports.isImport = typeChecker('import');
exports.Import = nodeCreator('import');

exports.isFunction = typeChecker('func');
exports.Function = nodeCreator('func');

exports.isMacro = typeChecker('macro');
exports.Macro = nodeCreator('macro');

exports.condp = function condp(f, ...clauses) {
  return function(x) {
    const val = f(x);
    for(let [test, ret] of clauses) {
      if(val == test) return ret();
    }

    throw new Error('Could not match: ' + x);
  }
};

