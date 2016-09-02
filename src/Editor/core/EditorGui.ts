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
        if (getEnum(field.object, field.name)) {
            return this.enumField(field);
        } else {
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
                case 'eventsystem':
                    return this.eventSystem(field);
            }
        }
    }

    public static applyModifiedValues(): void {
        let inputs = document.querySelectorAll('#inspector input, #inspector select') as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            input.addEventListener('input', event => {
                let gameObject: GameObject = Inspector.selectedGameObject;
                let componentId = input.closest('.component').getAttribute('data-component-id');
                let inputName = input.getAttribute('data-name');
                gameObject.components.forEach(comp => {
                    if (comp.instanceId == componentId) {
                        let properties: string[] = Object.getOwnPropertyNames(comp);
                        properties.forEach(property => {
                            if (property == inputName) {
                                let type = input.getAttribute('data-type').toLowerCase();
                                if (type == 'number') {
                                    let min = parseFloat(input.getAttribute('min'));
                                    let max = parseFloat(input.getAttribute('max'));
                                    let value = parseFloat(input.value);
                                    if (min != NaN) { value = value < min ? min : value; }
                                    if (max != NaN) { value = value > max ? max : value; }
                                    comp[property] = value;
                                } else {
                                    comp[property] = input.value;
                                }
                            } else if (comp[property] instanceof EventSystem) {
                                Object.getOwnPropertyNames(comp[property]).forEach(prop => {
                                    if (inputName == prop) {
                                        if (prop == 'event') {
                                            comp[property][prop] = parseInt(input.value);
                                        } else {
                                            comp[property][prop] = input.value;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    }

    public static vector3Field(field: SerializedProperty): void {
        let comp: Vector3 = field.vector3Value;
        let tooltip = getTooltip(field.object, field.name);
        this.draw(`<div class="property-name col-4" title="${tooltip}">${field.displayName}</div>
            <div class="input-group col-8">
                <div><span>X</span><span><input type="text" class="input" value="${comp.x}"></span></div>
                <div><span>Y</span><span><input type="text" class="input" value="${comp.y}"></span></div>
                <div><span>Z</span><span><input type="text" class="input" value="${comp.z}"></span></div>
            </div>`);
    }

    public static booleanField(field: SerializedProperty): void {
        let tooltip = getTooltip(field.object, field.name);
        this.draw(`<div class="property-name col-4" title="${tooltip}">${field.displayName}</div>
        <div class="col-8">
            <input type="checkbox" class="input" ${(field.boolValue ? 'checked="checked"' : '')}>
        </div>`);
    }

    public static stringField(field: SerializedProperty): void {
        let tooltip = getTooltip(field.object, field.name);
        this.draw(`<div class="property-name col-4" title="${tooltip}">${field.displayName}</div>
        <div class="col-8">
            <input data-name="${field.name}" data-type="${field.type}" type="text" class="input" value="${field.stringValue}">
        </div>`);
    }

    public static numberField(field: SerializedProperty): void {
        let range = getRange(field.object, field.name);
        let steps = getSteps(field.object, field.name);
        let tooltip = getTooltip(field.object, field.name);
        let fieldExtra = '';
        let input = `<input type="number" data-property-id="${field.id}" data-name="${field.name}" data-type="${field.type}" ${range[0] ? 'min="' + range[0] + '"' : ''} ${range[1] ? 'max="' + range[1] + '"' : ''} class="input" value="${field.numberValue}">`;
        if (range[0] && range[1]) {
            fieldExtra = `<div class="col-6"><input class="input-range" ${steps ? `list="steplist-${field.id}"` : ''} data-property-id="${field.id}" data-name="${field.name}" data-type="${field.type}" value="${field.numberValue}" type="range" min="${range[0]}" max="${range[1]}"></div>`;
            fieldExtra += `<div class="col-2">${input}</div>`;
            if (steps) {
                fieldExtra += `<datalist id="steplist-${field.id}">`;
                fieldExtra += '<option>' + steps.join('</option><option>') + '</option>';
                fieldExtra += `</datalist>`;
            }
        } else {
            fieldExtra = `<div class="col-8">${input}</div>`;
        }
        this.draw(`<div class="property-name col-4" title="${tooltip}">${field.displayName}</div><div class="number-property">${fieldExtra}</div>`);
    }

    public static colorField(field: SerializedProperty): void {
        let tooltip = getTooltip(field.object, field.name);
        this.draw(`<div class="property-name col-4" title="${tooltip}">${field.displayName}</div>
        <div class="col-8">
            <div data-name="${field.name}" data-type="${field.type}" data-color="${field.colorValue.hex}" class="color-property col-8" style="background-color: #${field.colorValue.hex};"></div>
        </div>`);
    }

    public static spriteField(field: SerializedProperty): void {
        let tooltip = getTooltip(field.object, field.name);
        this.draw(`<div class="property-name col-4" title="${tooltip}">${field.displayName}</div>
        <div class="col-8">
            <div data-name="${field.name}" data-type="${field.type}" class="input clickable sprite-property">
                <img src="${field.value.path}" width="16px" height="16px" style="display: inline-block;margin-top: 2px;vertical-align: middle;margin-right: 5px;">
                <span style="display: inline-block; vertical-align: middle;">${field.value.name || 'None'}</span>
            </div>
        </div>`);
    }

    public static enumField(field: SerializedProperty): void {
        let items = getEnum(field.object, field.name);
        let tooltip = getTooltip(field.object, field.name);
        let options: string[] = [];
        for (let v in items) {
            if(parseInt(v) >= 0) { continue; }
            options.push(`<option value="${items[v]}" ${items[v] == field.value ? 'selected="selected"' : ''}>${Editor.getDisplayName(v)}</option>`);
        }
        this.draw(`<div class="property-name col-4" title="${tooltip}">${field.displayName}</div>
            <div class="col-8">
                <select class="input" data-name="${field.name}" data-type="${field.type}">${options.join('')}</select>
            </div>
        `);
    }

    public static eventSystem(field: SerializedProperty): void {
        let system = field.eventSystemValue;
        let obj: SerializedObject = Editor.serialize(field.eventSystemValue);

        let event: SerializedProperty = obj.findProperty('event');

        EditorGui.propertyField(event);
        // Keyboard events
        if (event.value == Events.Keyboard || event.value == Events.KeyPress || event.value == Events.KeyRelease) {
            let key: SerializedProperty = obj.findProperty('key');
            EditorGui.propertyField(key);
        }
        // Mouse Events
        else if (event.value == Events.MousePress || event.value == Events.MouseRelease) {
            let mouseButton: SerializedProperty = obj.findProperty('mouseButton');
            EditorGui.propertyField(mouseButton);
        }
    }
}