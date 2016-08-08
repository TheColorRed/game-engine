import Component from './Component';
export default class Obj {

    public name: string = '';
    public isEnabled: boolean = true;
    public shouldDisable: boolean = false;
    public lastFrameEnabled: boolean = false;

    protected components: Component[] = [];

    public getComponents(): Component[] {
        return this.components;
    }

    public getInstanceId() {

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

}