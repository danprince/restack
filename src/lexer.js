/**
 * Creates a lexer function from an array of token definitions.
 *
 * @param {Array} types The types parameter should be an array
 * of objects that each have `name:string` and `pattern:regex`
 * properties. E.g `[{ name: 'number', pattern: /\d/ }]`.
 *
 * @returns {Function} A function which accepts a string of
 * characters and converts them into an array of tokens, where
 * a token is an object that has `type:string`, `raw:string`,
 * `line:number` and `col:number` properties.
 */
function createLexer(types) {
  return function lexer(chars) {
    const tokens = [];
    let pos = 0;
    let line = 1;
    let col = 1;

    lexloop: while(pos < chars.length) {
      if(chars[pos] == '\n') {
        line += 1;
        col = 1;
        pos += 1;
      } else if(/\s/.test(chars[pos])) {
        col += 1;
        pos += 1;
      } else {
        const rest = chars.slice(pos);

        for(let type of types) {
          const matches = rest.match(type.pattern);

          if(matches) {
            const [match] = matches;

            const token = {
              type: type.name,
              raw: match,
              line, col
            };

            col += match.length;
            pos += match.length;

            tokens.push(token);
            continue lexloop;
          }
        }

        throw new Error(`Unexpected token: "${chars[pos]}"`);
      }
    }

    return tokens;
  };
}

module.exports = createLexer;

