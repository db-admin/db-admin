// ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);

const sails: any = require("sails");
let rc: any = require("rc");
rc = rc("sails");

// sails My Admin
const fs: any = require("fs");
const dbaConfig: any = JSON.parse(fs.readFileSync("dba.config.json"));

rc.connections = {
  "userSpecified": dbaConfig.connections[dbaConfig.connection]
};
rc.globals = {
  "title": dbaConfig.title
};

sails.lift(rc, error => {
  if (error) {
    return console.error(error);
  }
  console.log("Ready at localhost:1337");
});