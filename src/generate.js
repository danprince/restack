function generate(node) {
  return generateType[node.type](node);
}

function indent(str) {
  return '  ' + str;
}

const generateType = {
  expression(node) {
    return `(function() {
  var $stack = [];
  var $scope = require('./src/natives');
${node.terms.map(generate).map(indent).join('\n')}
})()`;
  },
  import(node) {
    const genImport = v => `$scope['${v}'] = _tmp['${v}'];\n`;
    return `var _tmp = require('${node.path}');
  ${node.exposes.map(genImport).join('\n')}`;
  },
  func(node) {
    return `\n  exports['${node.name}'] = $scope['${node.name}'] = function(stack) {
${node.body.terms.map(generate).map(indent).map(indent).join('\n')}
    return $stack;
  };\n`;
  },
  macro() {

  },
  block(node) {
    return `$stack.push([
        ${node.expression.terms.map(generate).map(indent).join('\n')}
      ]);`;
  },
  number(node) {
    return `$stack.push(${node.raw});`;
  },
  string(node) {
    return `$stack.push(${node.raw});`;
  },
  symbol(node) {
    return `$stack = $scope['${node.name}']($stack);`;
  }
};

module.exports = generate;

