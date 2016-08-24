class EditorGui {

    private monkey: string;

    protected static draw(drawString: string) {
        let compItem = document.createElement('div') as HTMLDivElement;
        compItem.classList.add('component-property');
        compItem.classList.add('row');
        compItem.innerHTML = drawString;
        let inputs = compItem.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('click', (event) => {
                inputs[i].select();
            });
        }
        Editor.inspector.appendChild(compItem);
    }

    public static propertyField(field: SerializedProperty): void {
        let fieldToDraw: string = '';
        switch (field.type.toLowerCase()) {
            case 'boolean':
                return this.booleanField(field);
            case 'string':
                return this.stringField(field);
            case 'number':
                return this.numberField(field);

            case 'vector3':
                return this.vector3Field(field);
            case 'color':
                return this.colorField(field);
            case 'sprite':
                return this.spriteField(field);
        }
    }

    public static applyModifiedValues(): void {
        let inputs = document.querySelectorAll('#inspector input') as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            input.addEventListener('input', event => {
                let gameObjectId = document.querySelector('#inspector').getAttribute('data-gameobject-id');
                let gameObject = GameObjectManager.getItemById(gameObjectId);
                let componentId = input.closest('.component').getAttribute('data-component-id');
                gameObject.components.forEach(comp => {
                    if (comp.instanceId == componentId) {
                        let properties: string[] = Object.getOwnPropertyNames(comp);
                        properties.forEach(property => {
                            if (property == input.getAttribute('data-name')) {
                                comp[property] = input.value;
                            }
                        });
                    }
                });
            });
        }
    }

    public static vector3Field(field: SerializedProperty): void {
        let comp: Vector3 = field.vector3Value;
        this.draw(`<div class="property-name col-4">${field.displayName}</div>
            <div class="input-group col-8">
                <div><span>X</span><span><input type="text" class="input" value="${comp.x}"></span></div>
                <div><span>Y</span><span><input type="text" class="input" value="${comp.y}"></span></div>
                <div><span>Z</span><span><input type="text" class="input" value="${comp.z}"></span></div>
            </div>`);
    }

    public static booleanField(field: SerializedProperty): void {
        this.draw(`<div class="property-name col-4">${field.displayName}</div><div class="col-8"><input type="checkbox" class="input" ${(field.boolValue ? 'checked="checked"' : '')}></div>`);
    }

    public static stringField(field: SerializedProperty): void {
        this.draw(`<div class="property-name col-4">${field.displayName}</div><div class="col-8"><input type="text" class="input" value="${field.stringValue}"></div>`);
    }

    public static numberField(field: SerializedProperty): void {
        let range = getRange(field.object, field.name);
        this.draw(`<div class="property-name col-4">${field.displayName}</div>
        <div class="col-8">
            <input type="number" data-name="${field.name}" ${range[0] ? 'min="' + range[0] + '"' : ''} ${range[1] ? 'max="' + range[1] + '"' : ''} class="input" value="${field.numberValue}">
        </div>`);
    }

    public static colorField(field: SerializedProperty): void {
        this.draw(`<div class="property-name col-4">${field.displayName}</div>
        <div class="col-8">
            <div data-name="${field.name}" data-color="${field.colorValue.hex}" class="color-property col-8" style="background-color: #${field.colorValue.hex};"></div>
        </div>`);
    }

    public static spriteField(field: SerializedProperty): void {
        this.draw(`<div class="property-name col-4">${field.displayName}</div>
        <div class="col-8">
            <div data-name="${field.name}" class="input clickable sprite-property">
                <img src="${field.value.path}" width="16px" height="16px" style="display: inline-block;margin-top: 2px;vertical-align: middle;margin-right: 5px;">
                <span style="display: inline-block; vertical-align: middle;">${field.value.name || 'None'}</span>
            </div>
        </div>`);
    }

}