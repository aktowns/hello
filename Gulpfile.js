var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    to5 = require('gulp-6to5'),
    concat = require('gulp-concat'),
    eslint = require('gulp-eslint');

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', '!src/**/*-compiled.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('default', function () {
  return gulp.src([
      'src/native.es6',
      'src/lambda.es6',
      'src/context.es6',
      'src/parser.es6',
      'src/**/*.es6',
      'src/main.es6',
      '!src/**/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(to5())
    .pipe(concat('hello.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});