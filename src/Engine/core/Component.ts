interface ComponentType<T extends Component> {
    new(): T;
}

class Component extends Obj {

    public options: any;
    public behavior: MonoBehavior;

    protected gameObject: GameObject;

    public hasStarted: boolean = false;
    public hasAwaken: boolean = false;

    public constructor() {
        super();
    }

    public setGameObject(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

}