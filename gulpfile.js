/// <reference path="./typings/gulp/gulp.d.ts"/>
var gulp    = require('gulp');
var gulptsc = require('gulp-tsc');
var asar    = require('asar');
var ncp     = require('ncp').ncp;
var rmdir   = require('rimraf');
var fs      = require('fs');

var gameEngine = {
    out: 'gameEngine.js',
    module: 'system',
    target: 'es6',
    removeComments: true,
    declaration: true,
    experimentalDecorators: true
};

var gameEditor = {
    out: 'gameEditor.js',
    module: 'system',
    target: 'es6',
    removeComments: true,
    declaration: true,
    experimentalDecorators: true
};

gulp.task('build', ['compile-game-editor'], function () {
    return new Promise(resolve => {
        ncp('./src/GameEditor/resources', './build/Editor/resources', function (error) {
            if (error) { throw error; }
            fs.createReadStream('./node_modules/reflect-metadata/Reflect.js').pipe(fs.createWriteStream('./build/reflect.js'));
            // fs.createReadStream('./node_modules/systemjs/dist/system.js').pipe(fs.createWriteStream('./build/system.js'));
            asar.createPackage('./build', './bin/GameEditor.asar', function (error) {
                if (error) { throw error; }
                console.log('done.');
                resolve();
            });
        });
    });
});

gulp.task('compile-game-editor', ['compile-editor'], function () {
     return gulp.src([
        // Editor files
        './src/GameEditor/**/*.ts',
     ]).pipe(gulptsc({
        module: 'commonjs',
        target: 'es6',
        removeComments: true,
        allowUnreachableCode: true
    })).pipe(gulp.dest('build/Editor/'));
});

gulp.task('compile-editor', ['compile-engine'], function () {
    return gulp.src([
        './src/Editor/core/Editor.ts',
        // './src/Editor/main.ts',
    ]).pipe(gulptsc(gameEditor)).pipe(gulp.dest('build'));
});

gulp.task('compile-engine', ['rm-build'], function () {
    return gulp.src([
        // Root of all objects
        './src/Engine/Editor/decorators/serializable.ts',
        './src/Engine/core/Obj.ts',
        './src/Engine/core/Component.ts',
        './src/Engine/core/Behavior.ts',
        './src/Engine/core/MonoBehavior.ts',
        './src/Engine/core/GameObject.ts',
        './src/Engine/core/Transform.ts',
        './src/Engine/core/ObjectManager.ts',
        './src/Engine/util/Time.ts',
        './src/Engine/util/Debug.ts',
        './src/Engine/util/color/Color.ts',
        './src/Engine/util/vector/Vector3.ts',
        './src/Engine/util/vector/Vector2.ts',
        './src/Engine/utils/Config.ts',
        './src/Engine/physics/Physics.ts',
        './src/Engine/main.ts',
    ]).pipe(gulptsc(gameEngine)).pipe(gulp.dest('build'));
});

gulp.task('rm-build', function () {
    return new Promise(resolve => {
        rmdir('./build', function (err) {
            if (err) { throw err; }
            resolve();
        });
    });
});