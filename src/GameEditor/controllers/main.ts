const { remote, ipcRenderer } = require('electron');

// Menus
require(__dirname + '/../menus/mainMenu');
const hierarchyMenu = require(__dirname + '/../menus/hierarchyMenu');
const gameObjectMenu = require(__dirname + '/../menus/gameObjectMenu');

// Utilities
import fs = require('fs');
import path = require('path');

// Sections
let hierarchy: HTMLDivElement, editor: HTMLDivElement, inspector: HTMLDivElement;
// Div views
let sceneView: HTMLDivElement, gameView: HTMLDivElement;
// Canvases
let sceneBg: HTMLCanvasElement, scene: HTMLCanvasElement;

// Toolbar buttons
let play: HTMLAnchorElement, pause: HTMLAnchorElement;

let rightClicked: HTMLElement, selected: HTMLElement;
let game: SpyNginMain = null;

let prefabs: Prefab[] = [];

// Initialize the window
window.addEventListener('load', () => {
    hierarchy = document.querySelector('section#hierarchy') as HTMLDivElement;
    hierarchy.addEventListener('mousedown', (event) => {
        if (event.button == 2) {
            console.log('here')
            hierarchyMenu.menu.popup();
        }
    });
    editor = document.querySelector('section#editor') as HTMLDivElement;
    inspector = document.querySelector('section#inspector') as HTMLDivElement;

    sceneView = document.querySelector('div#scene-view') as HTMLDivElement;
    gameView = document.querySelector('div#game-view') as HTMLDivElement;

    sceneBg = document.querySelector('canvas#background') as HTMLCanvasElement;
    scene = document.querySelector('canvas#scene') as HTMLCanvasElement;

    play = document.querySelector('a#play') as HTMLAnchorElement;
    pause = document.querySelector('a#pause') as HTMLAnchorElement;
    play.addEventListener('click', (event) => {
        event.preventDefault();
        // Game has started
        // Stop was pressed
        if (game instanceof SpyNginMain) {
            game.stopGame();
            game = null;
            play.classList.remove('active');
            pause.classList.remove('active');
            // Reset the editor
            EditorObjectManager.clear();
            prefabs.forEach(prefab => {
                EditorObjectManager.addItem(Prefab.toObject(prefab));
            });
            updateScene();
        }
        // Game has not started
        // Play was pressed
        else {
            game = new SpyNginMain();
            prefabs = [];
            EditorObjectManager.items.forEach(item => {
                prefabs.push(Prefab.create(item));
            });
            game.init(scene, prefabs);
            game.startGame();
            play.classList.add('active');
        }
    });
    pause.addEventListener('click', (event) => {
        event.preventDefault();
        if (game instanceof SpyNginMain) {
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
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
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

window.addEventListener('onUpdateScene', function (event: CustomEvent) {
    let drawOrder: GameObject[] = [];
    let context = scene.getContext('2d');
    context.clearRect(0, 0, scene.width, scene.height);
    EditorObjectManager.items.forEach(gameObject => {
        gameObject.components.forEach(comp => {
            if (comp instanceof Camera) {
                context.fillStyle = `#${comp.backgroundColor.hex}`;
                context.fillRect(0, 0, scene.width, scene.height);
            }
            if (comp instanceof SpriteRenderer && comp.sprite.image) {
                comp.sprite.image.onload = function() {
                    context.drawImage(comp.sprite.image, comp.transform.position.x, comp.transform.position.y);
                }
                if (comp.sprite.image) {
                    context.drawImage(comp.sprite.image, comp.transform.position.x, comp.transform.position.y);
                }
            }
        });
    });
});

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
    gameObject.components.forEach(comp => {
        if (comp.instanceId == content.componentId) {
            let properties: string[] = Object.getOwnPropertyNames(comp);
            properties.forEach(property => {
                if (property == content.propertyName) {
                    comp[property] = Color.fromHex(content.hexColor);
                }
            });
        }
    });
    drawInspector(gameObject);
    updateScene();
});

ipcRenderer.on('selector-selected', (event, content: { gameObjectId: string, componentId: string, propertyName: string, value: string }) => {
    let gameObject = EditorObjectManager.getItemById(content.gameObjectId);
    gameObject.components.forEach(comp => {
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
    drawInspector(gameObject);
    updateScene();
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
    let gameObject = EditorObjectManager.getItemById(rightClicked.getAttribute('data-id'));
    EditorObjectManager.removeItem(gameObject);
    clearInspector();
    updateScene();
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
    hierarchy.innerHTML = '';
    var depth = 0;
    var obj = event.detail;
    EditorObjectManager.items.forEach(gameObject => {
        let div = document.createElement('div');
        div.innerText = gameObject.name;
        div.classList.add('game-object');
        div.setAttribute('data-id', gameObject.instanceId);
        if (obj instanceof GameObject && obj.instanceId == gameObject.instanceId) {
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
    updateScene();
});

function setSelected(target: HTMLElement) {
    let objects: NodeListOf<HTMLElement> = hierarchy.querySelectorAll('.game-object') as NodeListOf<HTMLElement>;
    for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];
        obj.classList.remove('selected');
    }
    target.classList.add('selected');
    selected = target;
}

function clearInspector() {
    let objects: NodeListOf<HTMLElement> = hierarchy.querySelectorAll('.game-object.selected') as NodeListOf<HTMLElement>;
    if (objects.length == 0) {
        inspector.innerHTML = '';
        inspector.setAttribute('data-gameobject-id', '');
    }
}

window.addEventListener('onGameObjectSelected', (event: CustomEvent) => {
    selectGameObject(event.detail);
});

function selectGameObject(target: HTMLElement) {
    // let target = event.detail as HTMLElement;
    let id = target.getAttribute('data-id');
    inspector.setAttribute('data-gameobject-id', id);
    let gameObject = EditorObjectManager.getItemById(id);
    drawInspector(gameObject);
};

function updateScene() {
    window.dispatchEvent(new CustomEvent('onUpdateScene'));
}

function drawInspector(gameObject: GameObject) {
    inspector.innerHTML = '';
    gameObject.components.forEach(comp => {
        let inspectorComp = document.createElement('div') as HTMLDivElement;
        inspectorComp.classList.add('component');
        inspectorComp.setAttribute('data-component-id', comp.instanceId);
        let compTitle = document.createElement('div') as HTMLDivElement;
        compTitle.classList.add('component-title');
        compTitle.innerText = comp.name;

        inspectorComp.appendChild(compTitle);
        Editor.inspector = inspectorComp;
        Editor.activeGameObject = gameObject;
        for (let i = 0; i < Globals.editors.length; i++) {
            let editor: Editor = Globals.editors[i];
            if (comp.constructor.name == editor.targetName) {
                editor.setSerializedObject(comp);
                editor.onEnable();
                editor.onUpdate();
                break;
            }
        };
        inspector.appendChild(inspectorComp);
        EditorGui.applyModifiedValues();
    });

    let numberInputs = document.querySelectorAll('input[min], input[max]') as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < numberInputs.length; i++) {
        let input = numberInputs[i];
        input.addEventListener('blur', (event) => { validateRangeInput(input); });
        input.addEventListener('keypress', (event) => {
            if (event.keyCode == 13) {
                validateRangeInput(input);
            }
        });
    }


    let addComponent = document.createElement('div') as HTMLDivElement;
    addComponent.classList.add('component');
    addComponent.innerHTML = `<div class="row">
        <div class="col-8 col-offset-2">
            <a href="" class="btn btn-block add-component">Add Component</a>
        </div>
    </div>`;

    inspector.appendChild(addComponent);

    let compButton = document.querySelector('a.add-component') as HTMLAnchorElement;
    compButton.addEventListener('click', (event) => {
        event.preventDefault();
        // let componentNames: string[] = [];
        let componentItems: { name: string, type: string }[] = [];
        for (let i = 0; i < Globals.editors.length; i++) {
            let editor: Editor = Globals.editors[i];
            let path = getMenuPath(editor);
            if (path == undefined) {
                componentItems.push({ name: editor.targetName, type: editor.targetName });
            } else {
                if (path.length > 0) {
                    let items = path.split('/');
                    componentItems.push({ name: items[items.length - 1], type: editor.targetName });
                }
            }
        }
        let componentList = document.createElement('div') as HTMLDivElement;
        componentList.classList.add('component-list');
        componentList.innerHTML = `<div class="row">
            <div class="col-12">
                <div class="component-search-area">
                    <input type="text" class="component-search" placeholder="Search">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-center">
                <div class="component-header">Component</div>
            </div>
        </div>
        <div class="row componet-item-list">
        </div>`;
        addComponent.appendChild(componentList);
        let compSearchList = addComponent.querySelector('#inspector .component-list .componet-item-list') as HTMLInputElement;
        let compSearch = addComponent.querySelector('#inspector .component-list .component-search') as HTMLInputElement;

        componentItems.forEach(item => {
            let compItem = document.createElement('div') as HTMLDivElement;
            compItem.innerHTML = `<a href="" data-type="${item.type}">${item.name}</a>`;
            compItem.classList.add('col-12');
            compSearchList.appendChild(compItem);
        });
        let items = addComponent.querySelectorAll('#inspector .component-list .componet-item-list a') as NodeListOf<HTMLAnchorElement>;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.addEventListener('click', (event) => {
                event.preventDefault();
                gameObject.addComponent(item.getAttribute('data-type'));
                drawInspector(gameObject);
            });
        }

        compSearch.focus();
    });

    let colors: NodeListOf<HTMLDivElement> = document.querySelectorAll(`div.color-property`) as NodeListOf<HTMLDivElement>;
    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', (event) => {
            let target = event.currentTarget as HTMLElement;
            let propertyName = target.getAttribute('data-name');
            let color = target.getAttribute('data-color');
            window.dispatchEvent(new CustomEvent('onColorPicker', {
                detail: {
                    gameObjectId: inspector.getAttribute('data-gameobject-id'),
                    componentId: target.closest('.component').getAttribute('data-component-id'),
                    propertyName: propertyName,
                    color: color
                }
            }));
        });
    }
    let sprites: NodeListOf<HTMLDivElement> = document.querySelectorAll(`div.sprite-property`) as NodeListOf<HTMLDivElement>;
    for (var i = 0; i < sprites.length; i++) {
        sprites[i].addEventListener('click', (event) => {
            let target = event.currentTarget as HTMLElement;
            let propertyName = target.getAttribute('data-name');
            window.dispatchEvent(new CustomEvent('onSelector', {
                detail: {
                    gameObjectId: inspector.getAttribute('data-gameobject-id'),
                    componentId: target.closest('.component').getAttribute('data-component-id'),
                    propertyName: propertyName,
                    selectionType: 'sprite'
                }
            }));
        });
    }
    updateScene();
}

function validateRangeInput(input: HTMLInputElement) {
    let min = parseFloat(input.getAttribute('min'));
    let max = parseFloat(input.getAttribute('max'));
    if (parseFloat(input.value) < min) {
        input.value = min.toString();
    } else if (parseFloat(input.value) > max) {
        input.value = max.toString();
    }
}

window.addEventListener('onColorPicker', (event: CustomEvent) => {
    ipcRenderer.send('color-picker', event.detail);
});
window.addEventListener('onSelector', (event: CustomEvent) => {
    ipcRenderer.send('selector', event.detail);
});