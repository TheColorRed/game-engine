class EditorGui {

    protected static draw(drawString: string) {
        let compItem = document.createElement('div') as HTMLDivElement;
        compItem.classList.add('component-property');
        compItem.innerHTML = drawString;
        let inputs = compItem.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < inputs.length; i++){
            inputs[i].addEventListener('click', (event) => {
                inputs[i].select();
            });
        }
        Editor.inspector.appendChild(compItem);
    }

    public static propertyField(field: SerializedProperty): void {
        let fieldToDraw: string = '';
        switch (field.type.toLowerCase()) {
            case 'vector3':
                return this.vector3Field(field);
            case 'boolean':
                return this.booleanField(field);
            case 'string':
                return this.stringField(field);
            case 'color':
                return this.colorField(field);
        }
    }

    public static vector3Field(field: SerializedProperty): void {
        let comp: Vector3 = field.vector3Value;
        this.draw(`<div class="property-name">${field.displayName}</div>
            <div class="input-group">
                <div><span>X</span><span><input type="text" class="input" value="${comp.x}"></span></div>
                <div><span>Y</span><span><input type="text" class="input" value="${comp.y}"></span></div>
                <div><span>Z</span><span><input type="text" class="input" value="${comp.z}"></span></div>
            </div>`);
    }

    public static booleanField(field: SerializedProperty): void {
        this.draw(`<div class="property-name">${field.displayName}</div><input type="checkbox" class="input" ${(field.boolValue ? 'checked="checked"' : '')}>`);
    }

    public static stringField(field: SerializedProperty): void {
        this.draw(`<div class="property-name">${field.displayName}</div><input type="text" class="input" value="${field.stringValue}">`);
    }

    public static colorField(field: SerializedProperty): void {
        this.draw(`<div class="property-name">${field.displayName}</div><div data-name="${field.name}" data-color="${field.colorValue.hex}" class="color-property" style="background-color: #${field.colorValue.hex};"></div>`);
    }

}