var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var htmlbuild = require('gulp-htmlbuild');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var ts = require('gulp-typescript');
var rename = require('gulp-rename');
var useref = require('gulp-useref');
var replace = require('gulp-replace');

var version = '.3';

var tsProject = ts.createProject('tsconfig.json');

function handleError(error) {
    console.log('error' + error);
    this.emit('end');
}

gulp.task('ts-dev', function () {
    tsProject.src()
        .pipe(tsProject())
        .pipe(rename({'suffix': version}))
        .pipe(gulp.dest('dist-dev/scripts'))
        .pipe(connect.reload());
});

gulp.task('ts-prod', function () {
    tsProject.src()
        .pipe(tsProject())
        .pipe(uglify())
        .pipe(rename({'suffix': version + '.min'}))
        .pipe(gulp.dest('dist-prod/scripts'));
});

gulp.task('sass-dev', function () {
    gulp.src('src/styles/*.scss')
        .pipe(sass().on('error', handleError))
        .pipe(rename({'suffix': version}))
        .pipe(gulp.dest('dist-dev/styles'))
        .pipe(connect.reload());
});

gulp.task('sass-prod', function () {
    gulp.src('src/styles/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', handleError))
        .pipe(rename({'suffix': version + '.min'}))
        .pipe(gulp.dest('dist-prod/styles'));
});

gulp.task('js-dev', function () {
    gulp.src('src/scripts/**/*.js')
        .pipe(rename({'suffix': version}))
        .pipe(gulp.dest('dist-dev/scripts'))
        .pipe(connect.reload());
});

gulp.task('js-prod', function () {
    gulp.src('src/scripts/**/*.js')
        .pipe(uglify())
        .pipe(rename({'suffix': version + '.min'}))
        .pipe(gulp.dest('dist-prod/scripts'));
});

gulp.task('css-dev', function () {
    gulp.src('src/styles/**/*.css')
        .pipe(rename({'suffix': version}))
        .pipe(gulp.dest('dist-dev/styles'))
        .pipe(connect.reload());
});

gulp.task('css-prod', function () {
    gulp.src('src/styles/**/*.css')
        .pipe(minify())
        .pipe(rename({'suffix': version + '.min'}))
        .pipe(gulp.dest('dist-prod/styles'));
});

gulp.task('html-dev', function () {
    gulp.src('src/html/**/*.html')
        .pipe(replace(new RegExp('@version@', 'g'), version))
        .pipe(gulp.dest('dist-dev'))
        .pipe(connect.reload());
});

gulp.task('html-prod', function () {
    gulp.src('src/html/**/*.html')
        .pipe(replace(new RegExp('@version@', 'g'), version + '.min'))
        .pipe(gulp.dest('dist-prod'));
});

gulp.task('default', ['ts-dev', 'js-dev', 'css-dev', 'sass-dev', 'html-dev'], function () {
    console.log('tasks done !');
});

gulp.task('prod', ['ts-prod', 'js-prod', 'css-prod', 'sass-prod', 'html-prod'], function () {
    console.log('build prod done !');
});

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['default']);
});

gulp.task('connect', ['watch'], function() {
    connect.server({
        port: 8000,
        root: 'dist-dev/',
        livereload: true
    });
});