module.exports = [
  { name: 'string',  pattern: /^"[^"]*?"/ },
  { name: 'number',  pattern: /^\d+/ },
  { name: 'comment', pattern: /^--.*?\n?$/ },
  { name: 'open',    pattern: /^\(/ },
  { name: 'close',   pattern: /^\)/ },
  { name: 'symbol',  pattern: /^[^\s\(\)"]+/ }
];

