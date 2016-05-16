const genFile = require('./src/gen');
const path = process.argv[2];

if(path) {
  genFile(path);
} else {
  console.log('Need a path');
}

