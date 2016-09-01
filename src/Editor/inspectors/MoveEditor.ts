@customEditor(Move)
@setComponentMenu('Movement/Move')
class MoveEditor extends Editor {

    private eventSystem: SerializedProperty;
    private direction: SerializedProperty;
    private speed: SerializedProperty;

    public onEnable() {
        this.eventSystem = this.serializedObject.findProperty('eventSystem');
        this.direction = this.serializedObject.findProperty('direction');
        this.speed = this.serializedObject.findProperty('speed');
    }

    public onUpdate() {
        EditorGui.propertyField(this.eventSystem);
        if (this.eventSystem.eventSystemValue.event > 0) {
            EditorGui.propertyField(this.direction);
            EditorGui.propertyField(this.speed);
        }
    }

}