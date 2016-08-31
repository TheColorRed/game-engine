interface ComponentType<T extends Component> {
    new(): T;
}

class Component extends Obj {

    public options: any;
    public behavior: MonoBehavior;

    public gameObject: GameObject;
    public transform: Transform;

    public hasStarted: boolean = false;
    public hasAwaken: boolean = false;

    protected eventSystem: EventSystem = new EventSystem;

    public constructor() {
        super();
    }

    public setGameObject(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    public setTransform(transform: Transform) {
        this.transform = transform;
    }

    private createdEvent() {
        this.eventSystem['created']();
    }

}