
// # config

var path = require('path');
var parentDir = path.join(__dirname, '..');
var appDir = path.join(parentDir, 'app');
var pkg = require(path.join(parentDir, 'package'));
var assetsDir = path.join(parentDir,'assets');
var publicDir = path.join(assetsDir, 'public');
var viewsDir = path.join(appDir, 'views');
var maxAge = 24 * 60 * 60 * 1000;
var env = process.env;

exports = module.exports = function() {

  return {

    defaults: {
      pageTitle: 'Gulp AWS Splash',
      pageDescription: 'The open-source LaunchRock alternative',
      googleAnalytics: env.GA || 'TODO',
      mailChimp: {
        actionUrl: env.MC_AU || 'TODO',
        hiddenInputName: env.MC_HIN || 'TODO'
      },
      aws: {
        key: env.AWS_KEY || 'TODO',
        accessKeyId: env.AWS_KEY || 'TODO',
        secret: env.AWS_SECRET || 'TODO',
        secretAccessKey: env.AWS_KEY || 'TODO',
        distributionId: env.AWS_DI || 'TODO',
        patternIndex: /^\/index\-[a-f0-9]+\.html(\.gz)*$/gi,
        params: {
          Bucket: env.AWS_BUCKET || 'TODO'
        }
      },
      pkg: pkg,
      showStack: true,
      assetsDir: assetsDir,
      publicDir: publicDir,
      views: {
        dir: viewsDir,
        engine: 'jade'
      },
      trustProxy: true,
      staticServer: {
        maxAge: maxAge
      },
      url: 'http://localhost:3000',
      server: {
        host: 'localhost',
        cluster: false,
        env: 'development',
        port: 3000,
        ssl: {
          enabled: false,
          options: {}
        }
      },
      output: {
        handleExceptions: false,
        colorize: true,
        prettyPrint: false
      },
      logger: {
        'console': true,
        requests: true,
        mongo: false,
        file: false,
        hipchat: false,
        slack: false
      },
      less: {
        path: publicDir,
        options: {
          force: true
        }
      }
    },

    development: {},
    test: {}

  };

};

exports['@singleton'] = true;
