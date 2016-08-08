import Obj from './Obj';
import Component from './Component';
import MonoBehavior from './MonoBehavior';
import ObjectManager from './ObjectManager';

export default class GameObject extends Obj {

    public constructor(name: string = 'GameObject') {
        super();
        this.name = name;
        ObjectManager.addItem(this);
    }

    public addComponent<T extends MonoBehavior>(component: string, options?: { any }): Component {
        let comp;
        comp = new MonoBehavior() as T;
        comp.options = options;
        comp.name = component;
        comp.setBerryObject(this);
        comp.behavior = comp;
        comp.isEnabled = this.isEnabled;
        this.components.push(comp);
        return comp;
    }

    public getComponent(component: string): Component {
        let c = null;
        this.components.forEach(comp => {
            if (c != null) { return; }
            if (comp.name == component) { c = comp; }
        });
        return c;
    }

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