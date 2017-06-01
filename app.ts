// ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.
process.chdir(__dirname);

const sails: any = require("sails");
let rc: any = require("rc");
rc = rc("sails");

// sails My Admin
const fs: any = require("fs");
const dbaConfig: any = require("./dba.config");

// set sails settings to what is found in the dba.config.json file
rc.connections = {
  "userSpecified": dbaConfig.connections[dbaConfig.connection]
};

// make the 'title' available via sails.globals.title
rc.globals = {
  "title": dbaConfig.title
};

// run the app!
sails.lift(rc, error => {
  if (error) {
    return console.error(error);
  }
  console.log("Ready at localhost:1337");
});