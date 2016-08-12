/// <reference path="../../../build/gameEngine.d.ts"/>
/// <reference path="../../../build/gameEditor.d.ts"/>
const { remote, ipcRenderer } = require('electron');

// Menus
require(__dirname + '/../resources/menus/mainMenu');
import { hierarchyMenu } from './../resources/menus/hierarchyMenu';

import { Config } from './../utils/Config';
import { GameObjectManager } from './../utils/GameObjectManager';

// Utilities
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
    hierarchy.addEventListener('mousedown', (event) => {
        if (event.button == 2) {
            hierarchyMenu.popup();
        }
    });
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

window.addEventListener('onCreateGameobject', (event) => {
    var createGameObject = new GameObject;
    GameObjectManager.addItem(createGameObject);
});

window.addEventListener('onObjectManagerChanged', (event) => {
    hierarchy.innerHTML = '';
    var depth = 0;
    GameObjectManager.items.forEach(gameObject => {
        let div = document.createElement('div');
        div.innerText = gameObject.name;
        div.classList.add('game-object');
        div.setAttribute('data-id', gameObject.instanceId);
        div.addEventListener('click', (event) => {
            window.dispatchEvent(new CustomEvent('onGameObjectSelected', { detail: div }));
        });
        hierarchy.appendChild(div);
    });
});

window.addEventListener('onGameObjectSelected', (event: CustomEvent) => {
    let target = event.detail as HTMLElement;
    let id = target.getAttribute('data-id');
    let gameObject = GameObjectManager.getItemById(id);
    gameObject.components.forEach(comp => {
        inspector.innerHTML = '';
        let inspect = document.createElement('div') as HTMLDivElement;
        inspect.classList.add('component');
        let compTitle = document.createElement('div') as HTMLDivElement;
        compTitle.classList.add('component-title');
        compTitle.innerText = comp.name;

        Globals.editors.forEach(editor => {
            if (comp.constructor.name == editor.target.name) {
                editor.setActiveGameObject(gameObject);
                editor.setActiveComponent(comp);
                editor.onUpdate();
            }
        });

        inspect.appendChild(compTitle);
        // for (let key in comp) {
        //     if (isSerializable(comp, key)) {
        //         let compItem = document.createElement('div') as HTMLDivElement;
        //         compItem.classList.add('component-property');

        //         compItem.innerHTML = `<div class="component-name">${key}</div>
        //         <div class="input-group">
        //             <div><span>X</span><span><input type="text" class="input" value="${comp[key].x}"></span></div>
        //             <div><span>Y</span><span><input type="text" class="input" value="${comp[key].y}"></span></div>
        //             <div><span>Z</span><span><input type="text" class="input" value="${comp[key].z}"></span></div>
        //         </div>`;
        //         inspect.appendChild(compItem);
        //     }
        // }

        inspector.appendChild(inspect);

        // var name = comp.constructor.name;

        // var editorComponent = new Editor(name);
        // editors.push(editorComponent);

        // if (comp.constructor == ) {
        //     console.log('here')
        // }

        // var descr = Object.getOwnPropertyDescriptor(comp, 'position');
        // console.log(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(comp), 'position'));
        // for (var key in comp) {

        // }
    });

});