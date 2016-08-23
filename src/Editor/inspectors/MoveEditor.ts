@customEditor(Move)
@setComponentMenu('Movement/Move')
class MoveEditor extends Editor {

    private direction: SerializedProperty;
    private speed: SerializedProperty;

    public onEnable() {
        this.direction = this.serializedObject.findProperty('direction');
        this.speed = this.serializedObject.findProperty('speed');
    }

    public onUpdate() {
        EditorGui.propertyField(this.direction);
        EditorGui.propertyField(this.speed);
    }

}