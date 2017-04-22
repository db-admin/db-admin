// ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);
var sails = require('sails');
var rc = require('rc');
rc = rc('sails');
// Sails My Admin
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('sma.config.json'));
rc.connections = {
    'userSpecified': config.connections[config.connection]
};
rc.globals = {
    'title': config.title
};
sails.lift(rc, function (error) {
    if (error)
        return console.error(error);
    console.log('Ready at localhost:1337');
});
console.log('done');
//# sourceMappingURL=app.js.map