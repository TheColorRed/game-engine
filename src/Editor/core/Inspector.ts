class Inspector {

    protected static inspector: HTMLDivElement;
    protected static gameObject: GameObject = null;

    public static init() {
        this.inspector = document.querySelector('section#inspector') as HTMLDivElement;
    }

    public static setSelectedGameObject(gameObject: GameObject): void {
        this.gameObject = gameObject;
        this.draw();
    }

    public static get selectedGameObject(): GameObject {
        return this.gameObject;
    }

    public static draw() {
        this.inspector.innerHTML = '';
        this.gameObject.components.forEach(comp => {
            let inspectorComp = document.createElement('div') as HTMLDivElement;
            inspectorComp.classList.add('component');
            inspectorComp.setAttribute('data-component-id', comp.instanceId);
            let compTitle = document.createElement('div') as HTMLDivElement;
            compTitle.classList.add('component-title');
            compTitle.innerText = comp.name;

            inspectorComp.appendChild(compTitle);
            Editor.inspector = inspectorComp;
            Editor.activeGameObject = this.gameObject;
            for (let i = 0; i < Globals.editors.length; i++) {
                let editor: Editor = Globals.editors[i];
                if (comp.constructor.name == editor.targetName) {
                    editor.setSerializedObject(comp);
                    editor.onEnable();
                    editor.onUpdate();
                    break;
                }
            };
            this.inspector.appendChild(inspectorComp);
            EditorGui.applyModifiedValues();
        });

        let addComponent = document.createElement('div') as HTMLDivElement;
        addComponent.classList.add('component');
        addComponent.innerHTML = `<div class="row">
            <div class="col-8 col-offset-2">
                <a href="" class="btn btn-block add-component">Add Component</a>
            </div>
        </div>`;

        this.inspector.appendChild(addComponent);

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
                    this.gameObject.addComponent(item.getAttribute('data-type'));
                    this.draw();
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
                        gameObjectId: this.inspector.getAttribute('data-gameobject-id'),
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
                        gameObjectId: this.inspector.getAttribute('data-gameobject-id'),
                        componentId: target.closest('.component').getAttribute('data-component-id'),
                        propertyName: propertyName,
                        selectionType: 'sprite'
                    }
                }));
            });
        }

        let dropdowns: NodeListOf<HTMLSelectElement> = document.querySelectorAll('#inspector select') as NodeListOf<HTMLSelectElement>;
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].addEventListener('change', (event) => {
                EditorGui.applyModifiedValues();
                this.draw();
            });
        }

        let numberInputs = document.querySelectorAll('input[min], input[max]') as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < numberInputs.length; i++) {
            let input = numberInputs[i];
            input.addEventListener('blur', (event) => { this.validateRangeInput(input); });
            input.addEventListener('keypress', (event) => {
                if (event.keyCode == 13) {
                    this.validateRangeInput(input);
                }
            });
        }
        let ranges: NodeListOf<HTMLDivElement> = document.querySelectorAll('#inspector .number-property input') as NodeListOf<HTMLDivElement>;
        for (var i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            range.addEventListener('input', function(event){
                let target = event.currentTarget as HTMLInputElement;
                let id = target.getAttribute('data-property-id');
                if (target.getAttribute('type') == 'range') {
                    let textinput = document.querySelector(`#inspector .number-property input[type=number][data-property-id=${id}]`) as HTMLInputElement;
                    textinput.value = target.value || '0';
                } else {
                    let rangeinput = document.querySelector(`#inspector .number-property input[type=range][data-property-id=${id}]`) as HTMLInputElement;
                    if (rangeinput) {
                        rangeinput.value = target.value || '0';
                    }
                }
                EditorGui.applyModifiedValues();
            });
        }

        this.updateScene();
    }

    public static clear() {
        let objects: NodeListOf<HTMLElement> = document.querySelectorAll('#hierarchy .game-object.selected') as NodeListOf<HTMLElement>;
        if (objects.length == 0) {
            this.inspector.innerHTML = '';
            this.inspector.setAttribute('data-gameobject-id', '');
        }
    }

    private static validateRangeInput(input: HTMLInputElement) {
        let min = parseFloat(input.getAttribute('min'));
        let max = parseFloat(input.getAttribute('max'));
        if (parseFloat(input.value) < min) {
            input.value = min.toString();
        } else if (parseFloat(input.value) > max) {
            input.value = max.toString();
        }
    }

    private static updateScene() {
        window.dispatchEvent(new CustomEvent('onUpdateScene'));
    }

}