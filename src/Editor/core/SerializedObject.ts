class SerializedObject {

    protected object: Component;

    public constructor(object: Component) {
        this.object = object;
    }

    public get instance(): Function {
        return this.object.constructor;
    }

    public findProperty(key): SerializedProperty {
        return new SerializedProperty(this.object, key, this.object[key] || null);
    }

}