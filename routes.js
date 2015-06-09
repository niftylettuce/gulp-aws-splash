
// app - routes

var serveStatic = require('serve-static');
var express = require('express');

exports = module.exports = function(IoC, settings) {

  var app = this;

  app.get('/', function(req, res) {
    res.render('index');
  });

  // static server
  app.use(serveStatic(settings.publicDir, settings.staticServer));

};

exports['@require'] = [ '$container', 'igloo/settings' ];
