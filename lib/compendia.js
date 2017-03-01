'use strict';

// Reference the Hazel App
const Hazel = require('hazel-wiki').app;

// Pull in our custom config
const config = require('./config.default.js');

// Use the default Hazel Disk Storage Provider
const StorageProvider = require('hazel-wiki').storageProvider;

// initilize Hazel
let app = new Hazel(config, StorageProvider);
let server = app.server;

// setup the server
server.set('port', process.env.PORT || 8090);
server.set('ip', process.env.IP || '127.0.0.1');

// listen
server.listen(server.get('port'), server.get('ip'), () => {
  console.log('✔ Compendia server listening at %s:%d ', server.get('ip'), server.get('port'));
});