const types = [
  {
    name: 'string',
    pattern: /^"[^"]*?"/,
    parse: str => str.slice(1, -1)
  },
  {
    name: 'number',
    pattern: /^\d+/,
    parse: parseFloat
  },
  { name: 'comment', pattern: /^--.*?\n/ },
  { name: 'open',    pattern: /^\(/ },
  { name: 'close',   pattern: /^\)/ },
  { name: 'symbol',  pattern: /^[^\s\(\)"]+/ }
];

module.exports = types;
