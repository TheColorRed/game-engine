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
                let prop = c.toLowerCase();
                if (['gameobject'].indexOf(prop) > -1) { continue; }
                let prefabProp = new PrefabProperty;
                prefabProp.name = c;
                prefabProp.value = SpyNgin.clone(comp[c]);
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
            let name: string = comp.name.toLowerCase();
            if (name != 'transform') { newComp = gameObject.addComponent(comp.name); }
            if (!newComp) { newComp = gameObject.getComponent(comp.name); }
            if (!newComp) { return; }
            comp.properties.forEach(prop => {
                if (prop.value instanceof Transform || prop.value instanceof GameObject){
                    return;
                } else if (prop.value instanceof Sprite) {
                    newComp[prop.name] = Sprite.create(prop.value.path);
                }
                // else if (prop.value instanceof Vector3 || prop.value instanceof Vector2) {
                //     newComp[prop.name].x = prop.value.x;
                //     newComp[prop.name].y = prop.value.y;
                //     newComp[prop.name].z = prop.value.z || 0;
                // }
                else {
                    newComp[prop.name] = SpyNgin.clone(prop.value);
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