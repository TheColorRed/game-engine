class GameObject extends Obj {

    public tag: string = '';
    protected _transform: Transform;
    protected _components: Component[] = [];

    public constructor(name: string = 'GameObject') {
        super();
        this.name = name;
        this._transform = this.addComponent(Transform);
        console.log(Object(this._transform));
        ObjectManager.addItem(this);
    }

    public get transform(): Transform {
        return this._transform;
    }

    public get components(): Component[] {
        return this._components;
    }

    public compareTag(tagName: string): boolean {
        return this.tag == tagName;
    }

    public getComponents<T extends Component>(type: ComponentType<T>): T[] {
        var comps: T[] = [];
        this._components.forEach(comp => {
            if (comp instanceof type){
                comps.push(comp as T);
            }
        });
        return comps;
    }

    public addComponent<T extends Component>(type: ComponentType<T>): T {
        let comp;
        comp = new type() as T;
        comp.name = comp.constructor.name;
        comp.setGameObject(this);
        comp.behavior = comp;
        comp.isEnabled = this.isEnabled;
        this._components.push(comp);
        return comp;
    }

    public getComponent<T extends Component>(type: ComponentType<T>): T {
        for (let i = 0; i < this._components.length; i++) {
            if (this._components[i].constructor == type.constructor) {
                return this._components[i] as T;
            }
        }
        return null;
    }

    // public getComponent(component: string): Component {
    //     let c = null;
    //     this.components.forEach(comp => {
    //         if (c != null) { return; }
    //         if (comp.name == component) { c = comp; }
    //     });
    //     return c;
    // }

    public sendMessage(message: string) {
        this._components.forEach(comp => {
            if ((comp.hasAwaken && message == 'awake') || (comp.hasStarted && message == 'start') || !comp.isEnabled) {
                return;
            }
            if (!comp.hasAwaken && !comp.hasStarted && (message == 'update' || message == 'lateUpdate')) {
                return;
            }

            // Execute the behavior
            if (comp.isEnabled && typeof comp.behavior[message] == 'function') {
                comp.behavior[message]();
            }

            if (message == 'awake') {
                comp.hasAwaken = true;
            }
            if (message == 'start') {
                comp.hasStarted = true;
            }
            if (message == 'onEnable') {
                comp.behavior.isEnabled = true;
                this.isEnabled = true;
            }
            if (message == 'onDisable') {
                comp.behavior.isEnabled = false;
                this.isEnabled = false;
            }
        });
    }

}