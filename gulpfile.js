var gulp = require('gulp');
var asar = require('asar');
var gulptsc = require('gulp-tsc');
var ncp = require('ncp').ncp;
var rmdir = require('rimraf');

var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('build', ['compile-editor', 'compile-engine'], function () {
    ncp('./src/Editor/resources', './build/Editor/resources', function (err) {
        if (err) { throw err; }
        asar.createPackage('./build', './bin/GameEditor.asar', function () {
            console.log('done.');
        });
    });
});

gulp.task('compile-editor', function () {
    rmdir('./build', function (err) {
        if (err) { throw err; }
    });
    return gulp.src(['./src/Editor/**/*.ts'])
        .pipe(gulptsc())
        .pipe(gulp.dest('./build/Editor'));
});

gulp.task('compile-engine', function () {
    // return gulp.src(['src/Engine/**/*.ts'])
    //     .pipe(gulptsc({
    //         out: 'gameEngine.js',
    //         module: 'system',
    //         target: 'es6',
    //         removeComments: true
    //     }))
    //     .pipe(gulp.dest('build/'));
    return browserify()
        .add('./src/Engine/main.ts')
        .plugin(tsify, {typescript: 'ntypescript'})
        .bundle()
        .on('error', function (error) { throw error; })
        .pipe(source('gameEngine.js'))
        .pipe(buffer())
        .pipe(gulp.dest('build/'));
});