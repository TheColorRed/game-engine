const { remote, ipcRenderer } = require('electron');

// Menus
require(__dirname + '/../menus/mainMenu');
const hierarchyMenu = require(__dirname + '/../menus/hierarchyMenu');
const gameObjectMenu = require(__dirname + '/../menus/gameObjectMenu');

// Utilities
import fs = require('fs');
import path = require('path');

// Sections
let editor: HTMLDivElement;
// Div views
let sceneView: HTMLDivElement, gameView: HTMLDivElement;
// Canvases
let sceneBg: HTMLCanvasElement;

// Toolbar buttons
let play: HTMLAnchorElement, pause: HTMLAnchorElement;

let rightClicked: HTMLElement, selected: HTMLElement;
let game: SpyNgin = null;

let prefabs: Prefab[] = [];

// Initialize the window
window.addEventListener('load', () => {
    Scene.init();
    Inspector.init();
    Hierarchy.init(hierarchyMenu, gameObjectMenu);
    editor = document.querySelector('section#editor') as HTMLDivElement;

    sceneView = document.querySelector('div#scene-view') as HTMLDivElement;
    gameView = document.querySelector('div#game-view') as HTMLDivElement;

    sceneBg = document.querySelector('canvas#background') as HTMLCanvasElement;

    play = document.querySelector('a#play') as HTMLAnchorElement;
    pause = document.querySelector('a#pause') as HTMLAnchorElement;
    play.addEventListener('click', (event) => {
        event.preventDefault();
        // Game has started
        // Stop was pressed
        if (game instanceof SpyNgin) {
            game.stopGame();
            game = null;
            play.classList.remove('active');
            pause.classList.remove('active');
            // Reset the editor
            EditorObjectManager.clear();
            GameObjectManager.clear();
            prefabs.forEach(prefab => {
                EditorObjectManager.addItem(Prefab.toObject(prefab));
            });
        }
        // Game has not started
        // Play was pressed
        else {
            game = new SpyNgin();
            prefabs = [];
            EditorObjectManager.items.forEach(item => {
                prefabs.push(Prefab.create(item));
            });
            EditorObjectManager.clear();
            GameObjectManager.clear();
            game.init(Scene.currentScene, prefabs);
            game.startGame();
            play.classList.add('active');
        }
    });
    pause.addEventListener('click', (event) => {
        event.preventDefault();
        if (game instanceof SpyNgin) {
            if (game.isPlaying) {
                game.stopGame();
                pause.classList.add('active');
            } else {
                game.startGame();
                pause.classList.remove('active');
            }
        }
    });
});

ipcRenderer.on('rename-selected', () => {
    let text = selected.innerText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    let input: HTMLInputElement = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('data-original', text);
    input.setAttribute('data-id', selected.getAttribute('data-id'));
    input.setAttribute('value', text);
    input.addEventListener('keyup', (event) => {
        if (event.keyCode == 13) {
            let id: string = input.getAttribute('data-id');
            let gameObject: GameObject = EditorObjectManager.getItemById(id);
            gameObject.name = input.value;
            selected.innerText = input.value;
        }
        if (event.keyCode == 27) {
            selected.innerText = input.getAttribute('data-original');
        }
    });
    input.addEventListener('blur', (event) => {
        selected.innerText = input.getAttribute('data-original');
    });
    selected.innerHTML = '';
    selected.appendChild(input);
    input.select();
});

// Resize the scene when the window size changes or loads
window.addEventListener('resize', sceneBgRewrite);
window.addEventListener('load', sceneBgRewrite);

function sceneBgRewrite() {
    sceneBg.width = sceneView.clientWidth;
    sceneBg.height = sceneView.clientHeight;

    Scene.currentScene.width = sceneView.clientWidth;
    Scene.currentScene.height = sceneView.clientHeight;

    let transImage = new Image();
    transImage.src = __dirname + '/../images/transparent.png';

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

ipcRenderer.on('color-selected', (event, content: { gameObjectId: string, componentId: string, propertyName: string, hexColor: string }) => {
    let gameObject = EditorObjectManager.getItemById(content.gameObjectId);
    Inspector.selectedGameObject.components.forEach(comp => {
        if (comp.instanceId == content.componentId) {
            let properties: string[] = Object.getOwnPropertyNames(comp);
            properties.forEach(property => {
                if (property == content.propertyName) {
                    comp[property] = Color.fromHex(content.hexColor);
                }
            });
        }
    });
    Inspector.draw();
    Scene.update();
});

ipcRenderer.on('selector-selected', (event, content: { gameObjectId: string, componentId: string, propertyName: string, value: string }) => {
    Inspector.selectedGameObject.components.forEach(comp => {
        if (comp.instanceId == content.componentId) {
            let properties: string[] = Object.getOwnPropertyNames(comp);
            properties.forEach(property => {
                if (property == content.propertyName) {
                    let sprite: Sprite = Sprite.create(content.value);
                    sprite.name = path.parse(content.value).name;
                    comp[property] = sprite;
                }
            });
        }
    });
    Inspector.draw();
    Scene.update();
});

window.addEventListener('onCreateGameObject', (event: CustomEvent) => {
    let createGameObject = new GameObject;
    let isChild: boolean = (event.detail || {}).child || false;
    if (isChild) {
        let parent = EditorObjectManager.getItemById(rightClicked.getAttribute('data-id'));
        createGameObject.transform.parent = parent.transform;
    }
    EditorObjectManager.addItem(createGameObject);
});

window.addEventListener('onDeleteGameObject', (event) => {
    EditorObjectManager.removeItem(Inspector.selectedGameObject);
    Inspector.clear();
    Scene.update();
});

window.addEventListener('onCreateCamera', (event) => {
    let createCamera = new GameObject('Camera');
    createCamera.addComponent(Camera);
    EditorObjectManager.addItem(createCamera);
});

window.addEventListener('onCreateSprite', (event) => {
    let createSprite = new GameObject('Sprite');
    createSprite.addComponent(SpriteRenderer);
    EditorObjectManager.addItem(createSprite);
});

window.addEventListener('onObjectManagerChanged', (event: CustomEvent) => {
    Hierarchy.update(event.detail);
    Scene.update();
});

window.addEventListener('onGameObjectSelected', (event: CustomEvent) => {
    Hierarchy.selectGameObject(event.detail);
});

// function updateScene() {
//     window.dispatchEvent(new CustomEvent('onUpdateScene'));
// }

window.addEventListener('onColorPicker', (event: CustomEvent) => {
    ipcRenderer.send('color-picker', event.detail);
});
window.addEventListener('onSelector', (event: CustomEvent) => {
    ipcRenderer.send('selector', event.detail);
});