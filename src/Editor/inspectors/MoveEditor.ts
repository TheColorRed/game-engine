@customEditor(Move)
@setComponentMenu('Movement/Move')
class MoveEditor extends Editor {

    private direction: SerializedProperty;

    public onEnable() {
        this.direction = this.serializedObject.findProperty('direction');
    }

    public onUpdate() {
        EditorGui.propertyField(this.direction);
    }

}