module.exports = function parseGrammar(grammar) {
  const rules = grammar.split('\n');
  const ruleMap = {};

  rules.forEach(rule => {
    if(rule.length == 0) return;
    const [ name, _, ...clauses] = rule.split(' ');
    ruleMap[name] = partition('|', clauses);
  });

  return ruleMap;
};

function partition(divider, array) {
  const partitions = [];
  let part = [];

  array.forEach(item => {
    if(item === divider) {
      partitions.push(part);
      part = [];
    } else {
      part.push(item);
    }
  });

  partitions.push(part);

  return partitions;
}

