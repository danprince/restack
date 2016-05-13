const _ = {
  rule(clause) {
    return _.manyRules([clause]);
  },
  manyRules(clauses) {
    return {
      clauses: clauses,
      or(clause) {
        return _.manyRules(clauses.concat(clause));
      }
    }
  }
};

module.exports = _;

