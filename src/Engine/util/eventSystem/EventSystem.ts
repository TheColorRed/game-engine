enum Events {
    None, Create, Destroy, Alarm, Collision,
    Keyboard, Mouse, KeyPress, KeyRelease
}

class EventSystem {

    private createTriggered: boolean = false;
    private destroyTriggered: boolean = false;
    private alarmTriggered: boolean = false;
    private collisionTriggered: boolean = false;
    private keyboardTriggered: boolean = false;
    private mouseTriggered: boolean = false;
    private keyPressTriggered: boolean = false;
    private keyReleaseTriggered: boolean = false;

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