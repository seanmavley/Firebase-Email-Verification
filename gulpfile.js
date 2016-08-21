var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del'); // rm -rf
var cleanCSS = require('gulp-clean-css');
var browser = require('browser-sync').create();

var port = process.env.SERVER_PORT || 3000;

gulp.task('clean', function() {
  return del(['app/build']);
});

gulp.task('scripts', ['clean'], function() {
  var stream = gulp.src(['app/**/*.js', '!app/vendor/', '!app/vendor/**'])
    .pipe(concat('codeside.js'))
    .pipe(gulp.dest('app/build'))
    .pipe(rename('codeside.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/build'));
  return stream;
});

// not much of custom css to minify, but worth
// having available just in case 
gulp.task('minify-css', function() {
  var stream = gulp.src(['app/assets/styles/*.css'])
    .pipe(concat('app.css'))
    .pipe(gulp.dest('app/build'))
    .pipe(rename('app.min.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('app/build'));
  return stream;
})

gulp.task('build', ['scripts']);

// run this in background to rebuild js files
// serve content using firebase serve
gulp.task('watch', ['build'], function() {
  gulp.watch(['app/**/*.js', '!app/build/', '!app/build/**'], ['build'])
});

// templates and styles will be processed in parallel.
// clean will be guaranteed to complete before either start.
// clean will not be run twice, even though it is called as a dependency twice.

gulp.task('serve', ['build'], function() {
  browser.init({ server: 'app/', port: port });
  // watch and rebuild scripts
  gulp.watch(['app/**/*.js', '!app/build/', '!app/build/**'], ['build'])
    // .on('change', browser.reload);
});

gulp.task('default', ['serve']);
