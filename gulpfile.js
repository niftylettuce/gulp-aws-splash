
// # gulpfile

var open = require('open');
var gls = require('gulp-live-server');
var cloudfront = require('gulp-cloudfront');
var awspublish = require('gulp-awspublish');
var gulp = require('gulp');
var rename = require('gulp-rename');
var csso = require('gulp-csso');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var exit = require('gulp-exit');
var bower = require('gulp-bower');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var imagemin = require('gulp-imagemin');
var del = require('del');
var runSequence = require('run-sequence');
var usemin = require('gulp-jade-usemin');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var rev = require('gulp-rev');
var RevAll = require('gulp-rev-all');
var through = require('through2');
var filter = require('gulp-filter');
var pngquant = require('imagemin-pngquant');

var server;

// <https://github.com/smysnk/gulp-rev-all>
var revAll = new RevAll({});

// load dependencies
var IoC = require('electrolyte');
IoC.loader(IoC.node(path.join(__dirname, 'boot')));
IoC.loader('igloo', require('igloo'));
var logger = IoC.create('igloo/logger');
var settings = IoC.create('igloo/settings');

// load scripts to lint
var scripts = [
  './app/**/*.js',
  './assets/public/**/*.js',
  '!./assets/public/bower/**/*.js',
  './boot/**/*.js',
  './etc/**/*.js'
];

gulp.task('postinstall', function(callback) {
  runSequence(
    'clean',
    'bower',
    'font-awesome',
    'less',
    'jshint'
  , callback);
});

gulp.task('jshint', function() {
  return gulp
    .src(scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('less', function() {
  return gulp
    .src([ './assets/public/css/**/*.less' ])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/public/css'));
});

gulp.task('bower', function() {
  return bower({
    force: true,
    directory: './assets/public/bower'
  }).pipe(gulp.dest('./assets/dist/bower'));
});

gulp.task('font-awesome', function() {
  return gulp
    .src('./assets/public/bower/font-awesome/fonts/**/*')
    .pipe(gulp.dest('./assets/public/fonts/font-awesome'));
});

gulp.task('clean', function() {
  return del([
    './assets/dist',
    './bower_components',
    './assets/public/fonts/font-awesome'
  ], {
    force: true
  });
});

gulp.task('imagemin', function () {
  return gulp
    .src('./assets/public/img/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [ { removeViewBox: false } ],
      use: [ pngquant() ]
    }))
    .pipe(gulp.dest('./assets/dist/img/'));
});

gulp.task('copy', function() {
  return gulp.src([
      './assets/public/404.html',
      './assets/public/favicon.ico',
      './assets/public/favicon.png',
      './assets/public/robots.txt',
      './assets/public/humans.txt',
      './assets/public/crossdomain.xml',
      './assets/public/browserconfig.xml',
      './assets/public/apple-touch-icon.png',
      './assets/public/tile-wide.png',
      './assets/public/tile.png'
    ])
    .pipe(gulp.dest('./assets/dist/'));
});

gulp.task('usemin-css', function() {

  var imageFilter = filter('**/*.{jpg,jpeg,gif,png}');
  var fontFilter = filter('**/*.{eot,svg,ttf,woff,woff2,otf}');
  var cssAndJsFilter = filter([
    '**/*.css',
    '**/*.js'
  ]);
  var cssFilter = filter('**/*.css');
  var jsFilter = filter('**/*.js');

  // create an accurate version of css with
  // images that have rev md5 hashes
  // and css that has updated image/font paths
  return gulp
    .src([
      'assets/public/img/**/*.{jpg,jpeg,gif,png}',
      'assets/public/fonts/**/*.{eot,svg,ttf,woff,woff2,otf}',
      'assets/public/js/**/*.js',
      'assets/public/css/**/*.css'
    ])
    .pipe(revAll.revision())
    .pipe(imageFilter)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [ { removeViewBox: false } ],
      use: [ pngquant() ]
    }))
    .pipe(gulp.dest('./assets/dist'))
    .pipe(imageFilter.restore())
    .pipe(fontFilter)
    .pipe(gulp.dest('./assets/dist'))
    .pipe(fontFilter.restore())
    .pipe(cssAndJsFilter)
    .pipe(through.obj(function(file, enc, cb) {
      file.path = file.revOrigPath;
      cb(null, file);
    }))
    .pipe(cssAndJsFilter.restore())
    .pipe(cssFilter)
    .pipe(gulp.dest('./assets/dist'))
    .pipe(cssFilter.restore())
    .pipe(jsFilter)
    .pipe(gulp.dest('./assets/dist'));
});

gulp.task('usemin-jade', function() {

  // create a dir full of jade, css, js files
  // that will be used in production in place
  // of the current app/views folder
  return gulp
    .src('./app/views/**/*.jade')
    .pipe(usemin({
      assetsDir: path.join(settings.assetsDir, 'dist'),
      css: [csso(), 'concat', rev() ],
      html: [minifyHtml({empty: true}), 'concat', rev() ],
      js: [ uglify(), 'concat', rev() ]
    }))
    .pipe(gulp.dest('./assets/dist'));

});

gulp.task('jade', function() {
  return gulp
    .src([
      './assets/dist/**/*.jade',
      '!./assets/dist/layout.jade'
    ])
    .pipe(jade({
      pretty: true,
      locals: {
        config: settings
      }
    }))
    .pipe(rev())
    .pipe(gulp.dest('./assets/dist'));
});

gulp.task('publish', function() {

  // create a new publisher
  var publisher = awspublish.create(settings.aws);

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp
    .src([
      './assets/dist/**/*',
      '!./assets/dist/**/*.jade',
      '!./assets/dist/bower/**/*'
    ])
     // gzip, Set Content-Encoding headers and add .gz extension
    .pipe(awspublish.gzip())
    //.pipe(awspublish.gzip({ ext: '.gz' }))
    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(publisher.publish(headers))
    // create a cache file to speed up consecutive uploads
    .pipe(publisher.cache())
     // print upload updates to console
    .pipe(awspublish.reporter())
    .pipe(cloudfront(settings.aws));
});

gulp.task('build', function(callback) {
  runSequence(
    'postinstall',
    'copy',
    'imagemin',
    'usemin-css',
    'usemin-jade',
    'jade'
  , callback);
});

gulp.task('deploy', function(callback) {
  runSequence(
    'build',
    'publish'
  , callback);
});

gulp.task('default', [ 'build' ]);

gulp.task('server', function() {
  server = gls.new('app.js', undefined, 35729);
  // <https://github.com/gimm/gulp-live-server/issues/14#issuecomment-110844827>
  server.start().then(null, null, function(code) {
    if (code.indexOf('app booted') !== -1)
      open('http://localhost:3000');
  });
});

gulp.task('watch', [ 'server' ], function() {
  gulp.watch('./app.js', function() {
    server.start.call(server);
  });
  gulp.watch([ './assets/public/css/**/*.less' ], [ 'less'] );
  gulp.watch([ './assets/public/css/**/*.css' ], function() {
    server.notify.apply(server, arguments);
  });
});
