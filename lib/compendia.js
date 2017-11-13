'use strict';

// file system
const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..');
const hazelDir = path.join(rootDir, 'hazel-wiki');

// Reference the Hazel App
const HazelWiki = require(path.join(hazelDir, 'index'));
const Hazel = HazelWiki.app;

// Pull in our custom config or use default
var configSrc;
if (fs.existsSync(path.join(rootDir, 'config.js'))) {
  configSrc = path.join(rootDir, 'config.js');
} else {
  configSrc = path.join(rootDir, 'config.default.js');
}

console.log('Loading config: ' + configSrc);
const config = require(configSrc);

// Use the default Hazel Disk Storage Provider
const StorageProvider = HazelWiki.storageProvider;

// initilize Hazel
let app = new Hazel(config, StorageProvider);
let server = app.server;

// setup the server
server.set('port', process.env.PORT || 8090);
server.set('host', process.env.HOST || 'localhost');

// listen
server.listen(server.get('port'), server.get('ip'), () => {
  console.log('✔ Compendia server listening at %s:%d ', server.get('host'), server.get('port'));
});

module.exports = {};
