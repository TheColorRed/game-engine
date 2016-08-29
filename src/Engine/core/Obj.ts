class Obj {

    public name: string = '';
    public isEnabled: boolean = true;
    public shouldDisable: boolean = false;
    public lastFrameEnabled: boolean = false;

    private _id: string = '';

    public constructor() {
        this._id = this.generateId();
    }

    public get instanceId(): string {
        return this._id;
    }

    public toString(): string {
        return this.name;
    }

    public static destroy() {

    }

    public static findObjectOfType() {

    }

    public static findObjectsOfType() {

    }

    public static instantiate() {

    }

    private generateId(): string {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

}