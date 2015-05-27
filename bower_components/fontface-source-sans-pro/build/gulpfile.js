'use strict';

/**
 * Dependencies
 */

var gulp = require('gulp');
var rename = require('gulp-rename');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var csscomb = require('gulp-csscomb');

/**
 * Tasks
 */

gulp.task('less', function () {
    gulp.src('../less/source-sans-pro.less')
        .pipe(less())
        .pipe(prefix([ '> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1' ]))
        .pipe(csscomb())
        .pipe(rename('source-sans-pro.css'))
        .pipe(gulp.dest('../css'))
        .pipe(rename('source-sans-pro.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('../css'));
});

/**
 * Default Task
 */

gulp.task('default', ['less']);