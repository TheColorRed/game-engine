class Editor {

    private _target: string;

    public constructor(component: string){
        this._target = component;
    }

    public get target(): string {
        return this._target;
    }

    public onUpdate() {
        console.log('here');
    }

}