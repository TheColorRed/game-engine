class SerializedProperty {

    protected _name: string;
    protected _property;
    protected _object: Obj;
    protected propertyId: string;

    public constructor(object: Obj, name: string, property: any) {
        this._name = name;
        this._property = property;
        this._object = object;
        this.propertyId = Editor.generateId();
    }

    public get id(): string {
        return this.propertyId;
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
        return Editor.getDisplayName(this._name);
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

    public get eventSystemValue(): EventSystem {
        return this._property as EventSystem;
    }

    public get value(): any {
        return this._property;
    }

}