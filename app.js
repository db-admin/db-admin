// Ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);

const sails = require('sails');
const rc = require('rc');

// Sails My Admin
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('sma.config.json'));

sails.lift({
  'connections': {
    'userSpecified': config.connections[config.connection]
  },
  'globals': {
    'title': config.title
  }
}, error => {
  if(error) return console.error(error);
  console.log('Ready at localhost:1337');
});
