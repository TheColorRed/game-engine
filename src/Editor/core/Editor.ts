class Editor {

    public targetName: string;
    protected target: Component;
    public static activeGameObject: GameObject;
    public static inspector: HTMLElement;
    public properties: string[] = [];

    protected serializedObject: SerializedObject;

    public constructor(object: Component) {
        this.target = object;
        this.targetName = object.name;
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

    public static getDisplayName(value: string): string {
        return this.toTitleCase(value.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').replace(/\s\s+/, ' ').trim());
    }

    private static toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    public static generateId(): string {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}