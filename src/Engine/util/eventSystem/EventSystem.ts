enum Events {
    None, Create, Destroy, Alarm, Collision,
    Keyboard, KeyPress, KeyRelease, MousePress, MouseRelease
}

class EventSystem {

    // Object events
    private createTriggered: boolean = false;
    private destroyTriggered: boolean = false;
    // Keyboard events
    // private keyboardTriggered: boolean = false;
    private keyPressTriggered: boolean = false;
    private keyReleaseTriggered: boolean = false;
    // Misc. events
    private alarmTriggered: boolean = false;
    private collisionTriggered: boolean = false;
    private mouseTriggered: boolean = false;

    private canvas: HTMLCanvasElement;

    @setEnum(Events)
    public event: Events = Events.None;

    public key: string = '';

    @range(0, 2)
    public mouseButton: number = 0;

    public constructor() {
        this.canvas = SpyNgin.canvas;
    }

    public hasEventTriggered(event?: Events) {
        if (!event) { event = this.event; }
        switch (event) {
            case Events.Create:
                console.log(this.createTriggered)
                return this.createTriggered;
            case Events.Destroy:
                return this.destroyTriggered;
            case Events.Alarm:
                return this.alarmTriggered;
            case Events.Collision:
                return this.collisionTriggered;
            case Events.Keyboard:
                for (let i = 0; i < Input.pressedKeys.length; i++) {
                    if (Input.pressedKeys[i].value == this.key) {
                        return true;
                    }
                }
                return false;
            case Events.KeyPress:
                for (let i = 0; i < Input.pressedKeys.length; i++) {
                    let key = Input.pressedKeys[i];
                    if (key.value == this.key && key.pressed) {
                        return true;
                    }
                }
                return false;
            case Events.KeyRelease:
                for (let i = 0; i < Input.pressedKeys.length; i++) {
                    let key = Input.pressedKeys[i];
                    if (key.value == this.key && !key.pressed) {
                        return true;
                    }
                }
                return false;
                // return this.keyReleaseTriggered;
            case Events.MousePress:
                return this.mouseTriggered;
            default:
                return false;
        }
    }

    private created(): void {
        this.createTriggered = true;
    }

}