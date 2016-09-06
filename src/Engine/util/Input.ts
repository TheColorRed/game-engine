enum InputAction {
    Left, Right, Up, Down,
    Fire, Jump, Submit, Cancel
}

enum KeyStatus { Pressed, Released }
enum ButtonStatus { Pressed, Released }

class Input {

    private static buttonDown: InputAction = null;

    private static keys: Key[] = [];
    private static buttons: Button[] = [];

    public static get pressedKeys(): Key[] {
        let pressed: Key[] = [];
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i].status == KeyStatus.Pressed) {
                pressed.push(this.keys[i]);
            }
        }
        return pressed;
    }

    public static get pressedButtons(): Button[] {
        let pressed: Button[] = [];
        for (let i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].status == ButtonStatus.Pressed) {
                pressed.push(this.buttons[i]);
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
            if (!hasKey) { this.createOrUpdateKey(event, true); }
        }, true);
        SpyNginEvents.addEvent('keyup', (event: KeyboardEvent) => {
            let hasKey = false;
            this.keys.forEach(key => {
                if (key.value == event.key) {
                    hasKey = true;
                    this.createOrUpdateKey(event, false, key);
                    key.tickCount = 0;
                }
            });
            if (!hasKey) { this.createOrUpdateKey(event, false); }
        }, true);

        SpyNginEvents.addEvent('mousedown', (event: MouseEvent) => {
            let hasButton = false;
            this.buttons.forEach(button => {
                if (button.value == event.button) {
                    hasButton = true;
                    button.status = ButtonStatus.Pressed;
                    if (button.tickCount == 0) {
                        button.pressed = true;
                    }
                }
            });
            if (!hasButton) { this.createOrUpdateButton(event, true); }
        });
        SpyNginEvents.addEvent('mouseup', (event: MouseEvent) => {
            let hasButton = false;
            this.buttons.forEach(button => {
                if (button.value == event.button) {
                    hasButton = true;
                    this.createOrUpdateButton(event, false, button);
                    button.tickCount = 0;
                }
            });
            if (!hasButton) { this.createOrUpdateButton(event, false); }
        }, true);
    }

    private static createOrUpdateKey(key: KeyboardEvent, pressed: boolean, current?: Key) {
        let k: Key;
        let idx: number;
        if (!current) {
            k = new Key;
        } else {
            idx = this.keys.indexOf(current);
            k = current;
        }
        k.value = key.key;
        k.pressed = pressed;
        if (pressed) {
            k.status = KeyStatus.Pressed;
        } else {
            k.status = KeyStatus.Released;
        }
        if (!current) {
            this.keys.push(k);
        } else {
            this.keys[idx] = k;
        }
    }

    private static createOrUpdateButton(button: MouseEvent, pressed: boolean, current?: Button) {
        let btn: Button;
        let idx: number;
        if (!current) {
            btn = new Button;
        } else {
            idx = this.buttons.indexOf(current);
            btn = current;
        }
        btn.value = button.button;
        btn.pressed = pressed;
        if (pressed) {
            btn.status = ButtonStatus.Pressed;
        } else {
            btn.status = ButtonStatus.Released;
        }
        if (!current) {
            this.buttons.push(btn);
        } else {
            this.buttons[idx] = btn;
        }
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

    private static endTick() {
        this.addTick();
        // Updated the pressed status for all pressed keys
        this.pressedKeys.forEach(key => {
            if (key.tickCount > 0) {
                key.pressed = false;
            }
        });
        // Update the pressed status for all buttons
        this.buttons.forEach(button => {
            if (button.tickCount > 0 && button.status == ButtonStatus.Pressed) {
                button.pressed = false;
           }
        });
    }

    private static addTick() {
        // Add a tick to all the pressed keys
        this.keys.forEach(key => {
            if (key.status == KeyStatus.Pressed) {
                key.tickCount++;
            }
        });
        // Add a tick to all the pressed buttons
        this.buttons.forEach(button => {
            if (button.status == ButtonStatus.Pressed) {
                button.tickCount++;
            }
        })
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

class Button {

    public value: number = 0;
    public pressed: boolean = false;
    public status: ButtonStatus = ButtonStatus.Released;
    public tickCount: number = 0;

}