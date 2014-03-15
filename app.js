/*

8888888b.  d8b          888
888  "Y88b Y8P          888
888    888              888
888    888 888 .d8888b  888888  8888b.  88888b.   .d8888b .d88b.
888    888 888 88K      888        "88b 888 "88b d88P"   d8P  Y8b
888    888 888 "Y8888b. 888    .d888888 888  888 888     88888888
888  .d88P 888      X88 Y88b.  888  888 888  888 Y88b.   Y8b.
8888888P"  888  88888P'  "Y888 "Y888888 888  888  "Y8888P "Y8888

*/


/**
 * Server initialization
 */
var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app);

var NAME          = 'Distance';
var PORT          = process.env.PORT || 2377;
var serverManager = require('./server/servermanager');

serverManager.run(app, server, NAME, PORT);