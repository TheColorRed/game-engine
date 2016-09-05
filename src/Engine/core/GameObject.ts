class GameObject extends Obj {

    public tag: string = '';
    private _transform: Transform;
    private _components: Component[] = [];
    private _eventSystem: EventSystem;

    public constructor(name: string = 'GameObject') {
        super();
        this.name = name;
        this._transform = this.addComponent(Transform);
        this._eventSystem = new EventSystem;
        GameObjectManager.add(this);
    }

    public get eventSystem(): EventSystem {
        return this._eventSystem;
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
        comp.isEnabled = this.isEnabled;
        this._components.push(comp);
        return comp;
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

    public sendMessage(message: string, options?: any) {
        this._components.forEach(comp => {
            // If the component is not enabled then don't do anything
            if (!comp.isEnabled) { return; }

            // If the message is 'awake' and we have already awaken
            // If the message is 'start' and we have already started
            // Then we don't do anything
            if (
                (comp.hasAwaken && message == 'awake') ||
                (comp.hasStarted && message == 'start')
            ) {
                return;
            }

            // If the message is 'update' and we have not started
            // If the message is 'lateUpdate' and we have not started
            // Then we don't do anything
            if (!comp.hasAwaken && !comp.hasStarted &&
                (message == 'update' || message == 'lateUpdate')
            ) {
                return;
            }

            if (message == 'keydown') {
                comp['eventSystem']['keyDown'](options.key);
            }
            if (message == 'keyup') {
                comp['eventSystem']['keyUp'](options.key);
            }

            // Execute the message on this component
            if (typeof comp[message] == 'function') {
                comp[message]();
            }

            // If the message is 'awake' set the awaken state
            if (message == 'awake') {
                comp.eventSystem['created']();
                comp.hasAwaken = true;
            }
            // If the message is 'start' set the started state
            if (message == 'start') {
                comp.hasStarted = true;
            }
            // If the message is 'onEnable' change the isEnabled state
            if (message == 'onEnable') {
                comp.isEnabled = true;
                this.isEnabled = true;
            }
            // If the message is 'onDisable' change the isEnabled state
            if (message == 'onDisable') {
                comp.isEnabled = false;
                this.isEnabled = false;
            }
        });
    }

}