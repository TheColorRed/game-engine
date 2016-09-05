@customEditor(MoveRandom)
@setComponentMenu('Movement/Move Random')
class MoveRandomEditor extends Editor {

    private eventSystem: SerializedProperty;
    private speed: SerializedProperty;

    public onEnable() {
        this.eventSystem = this.serializedObject.findProperty('eventSystem');
        this.speed = this.serializedObject.findProperty('speed');
    }

    public onUpdate() {
        EditorGui.propertyField(this.eventSystem);
        if (this.eventSystem.eventSystemValue.event > 0) {
            EditorGui.propertyField(this.speed);
        }
    }

}