// ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);
const sails = require("sails");
let rc = require("rc");
rc = rc("sails");
// sails My Admin
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("dba.config.json"));
rc.connections = {
    "userSpecified": config.connections[config.connection]
};
rc.globals = {
    "title": config.title
};
sails.lift(rc, error => {
    if (error) {
        return console.error(error);
    }
    console.log("Ready at localhost:1337");
});
//# sourceMappingURL=app.js.map