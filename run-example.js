const runFile = require('./src/run');
const path = process.argv[2];

if(path) {
  runFile(path);
} else {
  console.log('Need a path');
}

