@customEditor(Move)
@setComponentMenu('Movement/Move')
class MoveEditor extends Editor {

    private event: SerializedProperty;
    private direction: SerializedProperty;
    private speed: SerializedProperty;

    public onEnable() {
        this.event = this.serializedObject.findProperty('event');
        this.direction = this.serializedObject.findProperty('direction');
        this.speed = this.serializedObject.findProperty('speed');
    }

    public onUpdate() {
        EditorGui.propertyField(this.event);
        if (this.event.numberValue > 0) {
            EditorGui.propertyField(this.direction);
            EditorGui.propertyField(this.speed);
        }
    }

}