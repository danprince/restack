/**
 * Helper function for creating factory functions with a given
 * type of node.
 *
 * @param {String} type The type of node that the returned
 * factory function should create.
 *
 * @return {Function} A factory function which creates a node
 * with the given type and optionally merges it with any passed
 * properties.
 */
function nodeCreator(type) {
  if(typeof type != 'string') {
    throw new TypeError('nodeCreator must be called with a string');
  }

  return function(props={}) {
    return Object.assign({
      type: type,
    }, props);
  };
}

/**
 * Helper function for creating a type checking function that
 * will check the given type name against the type of whatever
 * node is passed in.
 *
 * @param {String} type The type name to check in the returned
 * function.
 *
 * @return {Function} A function which takes a node and checks
 * its type against the given type.
 */
function typeChecker(type) {
  if(typeof type != 'string') {
    throw new TypeError('typeChecker must be called with a string');
  }
  return function(node) {
    return node.type == type;
  }
}

exports.nodeCreator = nodeCreator;
exports.typeChecker = typeChecker;

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

exports.isBlockComment = typeChecker('bcomment');
exports.BlockComment = nodeCreator('bcomment');

exports.isImport = typeChecker('import');
exports.Import = nodeCreator('import');

exports.isFunction = typeChecker('func');
exports.Function = nodeCreator('func');

exports.isMacro = typeChecker('macro');
exports.Macro = nodeCreator('macro');

/**
 * Helper function for delayed evaluation with multiple
 * clauses. See https://clojuredocs.org/clojure.core/condp.
 *
 * @param {Function} pred The predicate function which will
 * be called with the input and test value from each clause.
 *
 * @param {Array} ...clauses Arrays of [test, thunk] which
 * make up the clauses for the predicate.
 *
 * @return {Any} The result of calling the thunk around
 * the return value.
 */
exports.condp = function condp(pred, ...clauses) {
  return function(a) {

    for(let [b, thunk] of clauses) {
      if(pred(b, a)) return thunk();
    }

    throw new Error(`Could not match: ${a}`);
  }
};

