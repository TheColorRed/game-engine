const { remote, ipcRenderer } = require('electron');
require(__dirname + '/../resources/menus/mainMenu');

import { Config } from './../utils/Config';
import fs = require('fs');

// Sections
let hierarchy: HTMLDivElement, editor: HTMLDivElement, inspector: HTMLDivElement;
// Div views
let sceneView: HTMLDivElement, gameView: HTMLDivElement;
// Canvases
let sceneBg: HTMLCanvasElement, scene: HTMLCanvasElement, game: HTMLCanvasElement;

// Initialize the window
window.addEventListener('load', () => {
    hierarchy = document.querySelector('section#hierarchy') as HTMLDivElement;
    editor = document.querySelector('section#editor') as HTMLDivElement;
    inspector = document.querySelector('section#inspector') as HTMLDivElement;

    sceneView = document.querySelector('div#scene-view') as HTMLDivElement;
    gameView = document.querySelector('div#game-view') as HTMLDivElement;

    sceneBg = document.querySelector('canvas#background') as HTMLCanvasElement;
    scene = document.querySelector('canvas#scene') as HTMLCanvasElement;
    game = document.querySelector('canvas#game') as HTMLCanvasElement;
});

// Resize the scene when the window size changes or loads
window.addEventListener('resize', sceneBgRewrite);
window.addEventListener('load', sceneBgRewrite);

function sceneBgRewrite() {
    sceneBg.width = sceneView.clientWidth;
    sceneBg.height = sceneView.clientHeight;

    scene.width = sceneView.clientWidth;
    scene.height = sceneView.clientHeight;

    let transImage = new Image();
    transImage.src = __dirname + '/../resources/images/transparent.png';

    transImage.onload = () => {
        let context: CanvasRenderingContext2D = sceneBg.getContext('2d');
        let pattern = context.createPattern(transImage, 'repeat');
        context.fillStyle = pattern;
        context.fillRect(0, 0, sceneBg.width, sceneBg.height);
    }
}

function showDirContents(path: string): Promise<{ dirs: string[], files: string[] }> {
    return new Promise(resolve => {
        let dirs: string[] = [];
        let files: string[] = [];
        fs.readdir(path, (err, foundFiles) => {
            foundFiles.forEach(file => {
                let stats = fs.statSync(`${path}/${file}`);
                if (stats.isDirectory()) {
                    dirs.push(file);
                } else if (stats.isFile()) {
                    files.push(file);
                } else {
                    files.push(file);
                }
            });
            dirs.sort();
            files.sort();
            resolve({ dirs: dirs, files: files });
        });
    });
}

ipcRenderer.on('open-project', (event, folders: string[]) => {
    if (folders && folders.length > 0) {
        Config.projectRoot = folders[0];
        showDirContents(Config.projectRoot).then(value => {
            console.log(value);
            value.dirs.forEach(dir => {
                console.log(dir);
            });
            value.files.forEach(file => {
                console.log(file);
            });
        });
    }
});