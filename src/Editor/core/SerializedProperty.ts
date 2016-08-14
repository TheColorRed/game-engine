class SerializedProperty {

    protected _name: string;
    protected object;

    public constructor(name: string, object: any) {
        this._name = name;
        this.object = object;
    }

    public get name(): string {
        return this._name;
    }

    public get displayName(): string {
        return this.toTitleCase(this._name.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').replace(/\s\s+/, ' ').trim());
    }

    public get type(): string {
        return this.object.constructor.name;
    }

    public get boolValue(): boolean {
        return this.object as boolean;
    }

    public get stringValue(): string {
        return this.object as string;
    }

    public get numberValue(): number {
        return this.object as number;
    }

    public get colorValue(): Color {
        return this.object as Color;
    }

    public get vector3Value(): Vector3 {
        return this.object as Vector3;
    }

    public get vector2Value(): Vector2 {
        return this.object as Vector2;
    }

    public get value(): any {
        return this.object;
    }

    private toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
}