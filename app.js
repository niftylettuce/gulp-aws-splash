
// # app

var path = require('path');
var IoC = require('electrolyte');
var bootable = require('bootable');
var express = require('express');

// change the working directory to the root directory

process.chdir(__dirname);

// dependency injection

IoC.loader(IoC.node(path.join(__dirname, 'boot')));
IoC.loader('igloo', require('igloo'));

// phases

var app = bootable(express());
app.phase(bootable.di.initializers());
app.phase(bootable.di.routes());
app.phase(IoC.create('igloo/server'));

// boot

var logger = IoC.create('igloo/logger');
var settings = IoC.create('igloo/settings');

app.boot(function(err) {

  if (err) {
    logger.error(err.message);

    if (settings.showStack) {
      logger.error(err.stack);
    }

    process.exit(-1);
    return;
  }

  logger.info('app booted');

  if (process.send)
    process.send('online');

});

// <https://github.com/andrewrk/naught#usage>
process.on('message', function(message) {

  // listen for shutdown event
  // (cleanup if necessary)
  if (message === 'shutdown') {
    // performCleanup();
    process.exit(0);
  }

});

exports = module.exports = app;
