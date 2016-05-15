function createLexer(types) {
  return function lex(chars) {
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

