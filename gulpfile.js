/// <reference path="./typings/gulp/gulp.d.ts"/>
var gulp    = require('gulp');
var gulptsc = require('gulp-tsc');
var asar    = require('asar');
var ncp     = require('ncp').ncp;
var rmdir   = require('rimraf');
var fs      = require('fs');

var gameEngine = {
    tscPath: './node_modules/typescript/lib/tsc.js',
    out: 'gameEngine.js',
    module: 'system',
    target: 'es6',
    removeComments: true,
    declaration: true,
    experimentalDecorators: true
};

var gameEditor = {
    tscPath: './node_modules/typescript/lib/tsc.js',
    out: 'gameEditor.js',
    module: 'system',
    target: 'es6',
    removeComments: true,
    declaration: true,
    experimentalDecorators: true
};

gulp.task('build', ['compile-game-editor'], function () {
    return new Promise(resolve => {
        // Move the built editor files to the proper location
        // For some reason they get placed in a source folder without the references file...
        ncp('./build/SpyNgin/src/GameEditor', './build/SpyNgin', function (error) {
            if (error) { throw error; }
            // Move the the resources that are not TypeScript files
            ncp('./src/GameEditor/resources', './build/SpyNgin/resources', function (error) {
                if (error) { throw error; }
                // Copy the Reflect library
                fs.createReadStream('./node_modules/reflect-metadata/Reflect.js').pipe(fs.createWriteStream('./build/reflect.js'));
                // Remove the src (the one copied from above)
                rmdir('./build/SpyNgin/src', function (error) {
                    if (error) { throw error; }
                    // Build the asar package
                    asar.createPackage('./build', './bin/SpyNgin.asar', function (error) {
                        if (error) { throw error; }
                        console.log('done.');
                        resolve();
                    });
                });
            });
        });
    });
});

gulp.task('compile-game-editor', ['compile-editor'], function () {
     return gulp.src([
        // Editor files
        './build/gameEditor.d.ts',
        './build/gameEngine.d.ts',
        './src/GameEditor/**/*.ts',
     ]).pipe(gulptsc({
        tscPath: './node_modules/typescript/lib/tsc.js',
        module: 'commonjs',
        target: 'es6',
        removeComments: true,
        experimentalDecorators: true
    })).pipe(gulp.dest('build/SpyNgin/'));
});

gulp.task('compile-editor', ['compile-engine'], function () {
    return gulp.src([
        './build/gameEngine.d.ts',
        './src/Editor/core/SerializedObject.ts',
        './src/Editor/core/SerializedProperty.ts',
        './src/Editor/core/EditorGui.ts',
        './src/Editor/core/EditorObjectManager.ts',
        './src/Editor/core/Editor.ts',
        './src/Editor/core/Inspector.ts',
        './src/Editor/core/Hierarchy.ts',
        './src/Editor/core/Scene.ts',
        './src/Editor/utils/EditorRandom.ts',
        './src/Editor/decorators/*.ts',
        './src/Editor/inspectors/*.ts',
    ]).pipe(gulptsc(gameEditor)).pipe(gulp.dest('build'));
});

gulp.task('compile-engine', ['rm-build'], function () {
    return gulp.src([
        // Root of all objects
        './src/Engine/core/Obj.ts',
        './src/Engine/core/Component.ts',
        './src/Engine/core/Behavior.ts',
        './src/Engine/core/MonoBehavior.ts',
        './src/Engine/core/GameObject.ts',
        './src/Engine/core/GameObjectManager.ts',
        './src/Engine/core/Prefab.ts',
        './src/Engine/decorators/*.ts',
        './src/Engine/util/Time.ts',
        './src/Engine/util/Debug.ts',
        './src/Engine/util/Sprite.ts',
        './src/Engine/util/Input.ts',
        './src/Engine/util/color/Color.ts',
        './src/Engine/util/vector/Vector2.ts',
        './src/Engine/util/vector/Vector3.ts',
        './src/Engine/util/eventSystem/*.ts',
        './src/Engine/utils/Config.ts',
        './src/Engine/physics/Physics.ts',
        './src/Engine/components/*.ts',
        './src/Engine/SpyNgin.ts',
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