class Editor {

    public target: Component;
    protected activeGameObject: GameObject;
    protected activeComponent: Component;

    // public get target(): Function {
    //     return this._target;
    // }


    public findField(key) {
        return this.activeComponent[key] || null;
    }

    public setActiveGameObject(gameObject: GameObject) {
        this.activeGameObject = gameObject;
    }

    public setActiveComponent(component: Component) {
        this.activeComponent = component;
    }

    public onUpdate() { }

}