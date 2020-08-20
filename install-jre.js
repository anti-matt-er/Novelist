const njb = require("node-java-connector");

njb.install(8, { type: "jre" }).catch(err => {
    console.log(err);
});