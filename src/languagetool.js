const njb = require("node-java-connector");

njb.executeJarCP(
    "lib/LanguageTool-5.0/languagetool-server.jar",
    "org.languagetool.server.HTTPServer",
    ["--port 8081"]
);