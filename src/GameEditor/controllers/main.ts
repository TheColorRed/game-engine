/// <reference path="../../../typings/game-engine/game-engine.d.ts"/>
const { remote, ipcRenderer } = require('electron');

// Menus
require(__dirname + '/../menus/mainMenu');
const hierarchyMenu = require(__dirname + '/../menus/hierarchyMenu');
const gameObjectMenu = require(__dirname + '/../menus/gameObjectMenu');

// Utilities
import fs = require('fs');

// Sections
let hierarchy: HTMLDivElement, editor: HTMLDivElement, inspector: HTMLDivElement;
// Div views
let sceneView: HTMLDivElement, gameView: HTMLDivElement;
// Canvases
let sceneBg: HTMLCanvasElement, scene: HTMLCanvasElement, game: HTMLCanvasElement;

let rightClicked: HTMLElement;

// Initialize the window
window.addEventListener('load', () => {
    hierarchy = document.querySelector('section#hierarchy') as HTMLDivElement;
    hierarchy.addEventListener('mousedown', (event) => {
        if (event.button == 2) {
            hierarchyMenu.menu.popup();
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

ipcRenderer.on('color-selected', (event, content: {gameObjectId: string, componentId: string, propertyName: string, hexColor: string}) => {
    let gameObject = GameObjectManager.getItemById(content.gameObjectId);
    gameObject.components.forEach(comp => {
        if(comp.instanceId == content.componentId){
            let properties: string[] = Object.getOwnPropertyNames(comp);
            properties.forEach(property => {
                if(property == content.propertyName){
                    comp[property] = Color.fromHex(content.hexColor);
                }
            });
        }
    });
    drawGui(gameObject);
});

window.addEventListener('onCreateGameobject', (event: CustomEvent) => {
    let createGameObject = new GameObject;
    let isChild: boolean = (event.detail || {}).child || false;
    if(isChild){
        let parent = GameObjectManager.getItemById(rightClicked.getAttribute('data-id'));
        createGameObject.transform.parent = parent.transform;
    }
    GameObjectManager.addItem(createGameObject);
});

window.addEventListener('onDeleteGameObject', (event) => {
    let gameObject = GameObjectManager.getItemById(rightClicked.getAttribute('data-id'));
    GameObjectManager.removeItem(gameObject);
    clearInspector();
});

window.addEventListener('onCreateCamera', (event) => {
    var createCamera = new GameObject('Camera');
    createCamera.addComponent(Camera);
    GameObjectManager.addItem(createCamera);
});

window.addEventListener('onObjectManagerChanged', (event: CustomEvent) => {
    hierarchy.innerHTML = '';
    var depth = 0;
    var obj = event.detail;
    GameObjectManager.items.forEach(gameObject => {
        let div = document.createElement('div');
        div.innerText = gameObject.name;
        div.classList.add('game-object');
        div.setAttribute('data-id', gameObject.instanceId);
        if(obj instanceof GameObject && obj.instanceId == gameObject.instanceId){
            setSelected(div);
            selectGameObject(div);
        }
        div.addEventListener('click', (event) => {
            setSelected(div);
            window.dispatchEvent(new CustomEvent('onGameObjectSelected', { detail: div }));
        });
        // Right clicked
        div.addEventListener('mousedown', (event) => {
            if (event.button == 2) {
                rightClicked = div;
                event.stopPropagation();
                gameObjectMenu.menu.popup();
            }
        });
        hierarchy.appendChild(div);
    });
});

function setSelected(target: HTMLElement){
    let objects: NodeListOf<HTMLElement> = hierarchy.querySelectorAll('.game-object') as NodeListOf<HTMLElement>;
    for(let i = 0; i < objects.length; i++){
        let obj = objects[i];
        obj.classList.remove('selected');
    }
    target.classList.add('selected');
}

function clearInspector(){
    let objects: NodeListOf<HTMLElement> = hierarchy.querySelectorAll('.game-object.selected') as NodeListOf<HTMLElement>;
    if(objects.length == 0){
        inspector.innerHTML = '';
        inspector.setAttribute('data-gameobject-id', '');
    }
}

window.addEventListener('onGameObjectSelected', (event: CustomEvent) => {
    selectGameObject(event.detail);
});

function selectGameObject(target: HTMLElement){
    // let target = event.detail as HTMLElement;
    let id = target.getAttribute('data-id');
    inspector.setAttribute('data-gameobject-id', id);
    let gameObject = GameObjectManager.getItemById(id);
    drawGui(gameObject);
};

function drawGui(gameObject: GameObject){
    inspector.innerHTML = '';
    gameObject.components.forEach(comp => {
        let inspectorComp = document.createElement('div') as HTMLDivElement;
        inspectorComp.classList.add('component');
        inspectorComp.setAttribute('data-component-id', comp.instanceId);
        let compTitle = document.createElement('div') as HTMLDivElement;
        compTitle.classList.add('component-title');
        compTitle.innerText = comp.name;

        inspectorComp.appendChild(compTitle);
        for(let i = 0; i < Globals.editors.length; i++){
            let editor: Editor = Globals.editors[i];
            if (comp.constructor.name == editor.targetName) {
                editor.setActiveGameObject(gameObject);
                editor.setSerializedObject(comp);
                Editor.inspector = inspectorComp;
                editor.onEnable();
                editor.onUpdate();
                break;
            }
        };
        inspector.appendChild(inspectorComp);
    });

    let colors: NodeListOf<HTMLDivElement> = document.querySelectorAll(`div.color-property`) as NodeListOf<HTMLDivElement>;
    for(var i = 0; i < colors.length; i++){
        colors[i].addEventListener('click', (event) => {
            let target = event.currentTarget as HTMLElement;
            let propertyName = target.getAttribute('data-name');
            let color = target.getAttribute('data-color');
            window.dispatchEvent(new CustomEvent('onColorPicker', { detail: {
                gameObjectId: inspector.getAttribute('data-gameobject-id'),
                componentId: target.closest('.component').getAttribute('data-component-id'),
                propertyName: propertyName,
                color: color
            } }));
        });
    }
}

window.addEventListener('onColorPicker', (event: CustomEvent) => {
    ipcRenderer.send('color-picker', event.detail);
});