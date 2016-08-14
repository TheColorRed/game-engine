class Editor {

    public targetName: string;
    protected target: Component;
    protected activeGameObject: GameObject;
    public static inspector: HTMLElement;
    public properties: string[] = [];

    protected serializedObject: SerializedObject;

    public constructor(object: Component) {
        this.target = object;
        this.targetName = object.name;
    }

    public setActiveGameObject(gameObject: GameObject) {
        this.activeGameObject = gameObject;
    }

    public setSerializedObject(component: Component) {
        this.serializedObject = new SerializedObject(component);
    }

    public onEnable() {
        // Override this in an editor
    }

    public onUpdate() {
        // Override this in an editor
    }

}