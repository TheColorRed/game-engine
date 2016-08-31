enum Events {
    None, Create, Destroy, Alarm, Collision,
    Keyboard, Mouse, KeyPress, KeyRelease
}

class EventSystem {

    // Object events
    private createTriggered: boolean = false;
    private destroyTriggered: boolean = false;
    // Keyboard events
    private keyboardTriggered: boolean = false;
    private keyPressTriggered: boolean = false;
    private keyReleaseTriggered: boolean = false;
    // Misc. events
    private alarmTriggered: boolean = false;
    private collisionTriggered: boolean = false;
    private mouseTriggered: boolean = false;

    private canvas: HTMLCanvasElement;

    public constructor() {
        this.canvas = SpyNgin.canvas;
    }

    public hasEventTriggered(event: Events) {
        switch (event) {
            case Events.Create:
                return this.createTriggered;
            case Events.Destroy:
                return this.destroyTriggered;
            case Events.Alarm:
                return this.alarmTriggered;
            case Events.Collision:
                return this.collisionTriggered;
            case Events.Keyboard:
                return this.keyboardTriggered;
            case Events.KeyPress:
                return this.keyPressTriggered;
            case Events.KeyRelease:
                return this.keyReleaseTriggered;
            case Events.Mouse:
                return this.mouseTriggered;
        }
    }

    private created(): void {
        this.createTriggered = true;
    }

}