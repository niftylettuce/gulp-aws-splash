
// # settings

var path = require('path');
var http = require('http');
var serveFavicon = require('serve-favicon');
var winstonRequestLogger = require('winston-request-logger');

exports = module.exports = function(IoC, settings, logger) {

  var app = this;

  // set the environment
  app.set('env', settings.server.env);

  app.server = http.createServer(this);

  // winston request logger before everything else
  // but only if it was enabled in settings
  if (settings.logger.requests)
    app.use(winstonRequestLogger.create(logger));

  // ignore GET /favicon.ico
  app.use(serveFavicon(path.join(settings.publicDir, 'favicon.ico')));

};

exports['@require'] = [ '$container', 'igloo/settings', 'igloo/logger' ];
