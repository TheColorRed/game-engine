enum InputAction {
    Left, Right, Up, Down,
    Fire, Jump, Submit, Cancel
}

class Input {

    private static buttonDown: InputAction = null;

    public static isButtonDown(input: InputAction) {
        return this.buttonDown == input;
    }

}