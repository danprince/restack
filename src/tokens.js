module.exports = [
  { name: 'bcomment', pattern: /^---[\s\S]*?---/ },
  { name: 'comment',  pattern: /^--.*(\n|$)/ },
  { name: 'string',   pattern: /^"[^"]*?"/ },
  { name: 'number',   pattern: /^-?\d*(\.?\d+)/ },
  { name: 'open',     pattern: /^\(/ },
  { name: 'close',    pattern: /^\)/ },
  { name: 'symbol',   pattern: /^[^\s\(\)"]+/ }
];

