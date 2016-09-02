enum InputAction {
    Left, Right, Up, Down,
    Fire, Jump, Submit, Cancel
}

enum KeyStatus { Pressed, Released }

class Input {

    private static buttonDown: InputAction = null;

    private static keys: Key[] = [];

    public static get pressedKeys(): Key[] {
        let pressed: Key[] = [];
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i].status == KeyStatus.Pressed) {
                pressed.push(this.keys[i]);
            }
        }
        return pressed;
    }

    public static init() {
        SpyNginEvents.addEvent('keydown', (event: KeyboardEvent) => {
            let hasKey = false;
            this.keys.forEach(key => {
                if (key.value == event.key) {
                    hasKey = true;
                    key.status = KeyStatus.Pressed;
                    if (key.tickCount == 0) {
                        key.pressed = true;
                    }
                }
            });
            if (!hasKey) { this.createKey(event.key, true); }
        }, true);
        SpyNginEvents.addEvent('keyup', (event: KeyboardEvent) => {
            let hasKey = false;
            this.keys.forEach(key => {
                if (key.value == event.key) {
                    hasKey = true;
                    key.pressed = false;
                    key.status = KeyStatus.Released;
                    key.tickCount = 0;
                }
            });
            if (!hasKey) { this.createKey(event.key, false); }
        }, true);
    }

    private static createKey(key: string, pressed: boolean) {
        let newKey = new Key;
        newKey.value = key;
        newKey.pressed = pressed;
        if (pressed) {
            newKey.status = KeyStatus.Pressed;
        } else {
            newKey.status = KeyStatus.Released;
        }
        this.keys.push(newKey);
    }

    public static isButtonDown(input: InputAction | string) {
        if (typeof input == 'string') {
            for (let i = 0; i < this.keys.length; i++) {
                if (this.keys[i].value == input && this.keys[i].status == KeyStatus.Pressed) {
                    return true;
                }
            }
            return false;
        } else {
            return this.buttonDown == input;
        }
    }

    private static addTick() {
        this.keys.forEach(key => {
            if (key.status == KeyStatus.Pressed) {
                key.tickCount++;
            }
        });
    }

}

class Key {

    /**
     * The key
     *
     * @type {string}
     */
    public value: string = '';

    /**
     * Whether or not the key was pressed this frame
     *
     * @type {boolean}
     */
    public pressed: boolean = false;

    /**
     * The current status of the key (Pressed or Released)
     *
     * @type {KeyStatus}
     */
    public status: KeyStatus = KeyStatus.Released;

    /**
     * The number of ticks the button has been pressed
     *
     * @type {number}
     */
    public tickCount: number = 0;

}