
// # views

var connectLiveReload = require('connect-livereload');
var lessMiddleware = require('less-middleware');

exports = module.exports = function(IoC, settings) {

  var app = this;

  // set the default views directory
  app.set('views', settings.views.dir);

  // set the default view engine
  app.set('view engine', settings.views.engine);

  if (settings.server.env === 'development') {

    app.use(connectLiveReload({
      port: 35729
    }));

    // make view engine output pretty
    app.locals.pretty = true;

    // less middleware
    app.use(lessMiddleware(settings.less.path, settings.less.options));

  }

  // expose settings to views as a dynamic helper
  app.locals.config = settings;

};

exports['@require'] = [ '$container', 'igloo/settings' ];
