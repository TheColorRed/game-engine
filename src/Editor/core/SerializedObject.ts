class SerializedObject {

    protected object: Obj;

    public constructor(object: Obj) {
        this.object = object;
    }

    public get instance(): Function {
        return this.object.constructor;
    }

    public findProperty(key): SerializedProperty {
        return new SerializedProperty(this.object, key, this.object[key]);
    }

}