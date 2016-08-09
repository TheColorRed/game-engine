class GameObject extends Obj {

    public tag: string = '';

    public constructor(name: string = 'GameObject') {
        super();
        this.name = name;
        ObjectManager.addItem(this);
    }

    public compareTag(tagName: string): boolean {
        return this.tag == tagName;
    }

    public getComponents<T extends Component>(component?: T): Component[] {
        var comps: Component[] = [];
        this.components.forEach(comp => {
            if (comp.constructor == component.constructor){
                comps.push(comp);
            }
        });
        return comps;
    }

    public addComponent<T extends MonoBehavior>(componentName: string = '', options?: { any }): Component {
        let comp;
        comp = new MonoBehavior() as T;
        comp.options = options;
        comp.name = componentName;
        comp.setBerryObject(this);
        comp.behavior = comp;
        comp.isEnabled = this.isEnabled;
        this.components.push(comp);
        return comp;
    }

    public getComponent<T extends Component>(component?: T): Component {
        for (let i = 0; i < this.components.length; i++){
            if (this.components[i].constructor == component.constructor) {
                return this.components[i];
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
        this.components.forEach(comp => {
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