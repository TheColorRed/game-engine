class Prefab {

    public name: string;
    public components: PrefabComponent[] = [];

    public static create(gameObject: GameObject): Prefab {
        let prefab = new Prefab;
        prefab.name = gameObject.name;
        gameObject.components.forEach(comp => {
            let prefabComp = new PrefabComponent;
            prefabComp.name = comp.name;
            for (let c in comp) {
                let prefabProp = new PrefabProperty;
                prefabProp.name = c;
                if (typeof comp[c] == 'object') {
                    prefabProp.value = Object.create(comp[c]);
                } else {
                    prefabProp.value = comp[c];
                }
                prefabComp.properties.push(prefabProp);
            }
            prefab.components.push(prefabComp);
        });
        return prefab;
    }

    public static toObject(prefab: Prefab): GameObject {
        let gameObject = new GameObject(prefab.name);
        prefab.components.forEach(comp => {
            let newComp;
            if (comp.name.toLowerCase() != 'transform') {
                newComp = gameObject.addComponent(comp.name);
            }
            if (!newComp) {
                newComp = gameObject.getComponent(comp.name);
            }
            comp.properties.forEach(prop => {
                if (prop.value instanceof Sprite) {
                    newComp[prop.name] = Sprite.create(prop.value.path);
                } else if (typeof prop.value == 'object') {
                    newComp[prop.name] = Object.create(prop.value);
                } else {
                    newComp[prop.name] = prop.value;
                }
            });
        });
        return gameObject;
    }

}

class PrefabComponent {

    public name: string;
    public properties: PrefabProperty[] = [];

}

class PrefabProperty {

    public name: string;
    public value: any;

}