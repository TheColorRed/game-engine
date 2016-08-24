class SerializedProperty {

    protected _name: string;
    protected _property;
    protected _object: Component;

    public constructor(object: Component, name: string, property: any) {
        this._name = name;
        this._property = property;
        this._object = object;
    }

    public get object(): any {
        return this._object;
    }

    public get property(): any {
        return this._property;
    }

    public get name(): string {
        return this._name;
    }

    public get displayName(): string {
        return this.toTitleCase(this._name.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').replace(/\s\s+/, ' ').trim());
    }

    public get type(): string {
        return this._property.constructor.name;
    }

    public get boolValue(): boolean {
        return this._property as boolean;
    }

    public get stringValue(): string {
        return this._property as string;
    }

    public get numberValue(): number {
        return this._property as number;
    }

    public get colorValue(): Color {
        return this._property as Color;
    }

    public get vector3Value(): Vector3 {
        return this._property as Vector3;
    }

    public get vector2Value(): Vector2 {
        return this._property as Vector2;
    }

    public get value(): any {
        return this._property;
    }

    private toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
}