class GameObject extends Obj {

    public tag: string = '';
    protected _transform: Transform;
    protected _components: Component[] = [];

    public constructor(name: string = 'GameObject') {
        super();
        this.name = name;
        this._transform = this.addComponent(Transform);
        GameObjectManager.add(this);
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
            if (comp instanceof type) {
                comps.push(comp as T);
            }
        });
        return comps;
    }

    public addComponent<T extends Component>(type: ComponentType<T> | string): T {
        let comp;
        if (typeof type === 'string') {
            let evalT = type.replace(/[^a-zA-Z0-9_]/ig, '');
            comp = new (eval(evalT))() as T;
        } else {
            comp = new type() as T;
        }
        comp.name = comp.constructor.name;
        comp.setGameObject(this);
        comp.setTransform(this._transform);
        comp.behavior = comp;
        comp.isEnabled = this.isEnabled;
        this._components.push(comp);
        return comp;
    }

    public getComponent<T extends Component>(type: ComponentType<T> | string): T {
        for (let i = 0; i < this._components.length; i++) {
            if (typeof type === 'string') {
                let evalT = type.replace(/[^a-zA-Z0-9_]/ig, '');
                if (this._components[i].constructor.name == evalT) {
                    return this._components[i] as T;
                }
            } else {
                if (this._components[i].constructor == type) {
                    return this._components[i] as T;
                }
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