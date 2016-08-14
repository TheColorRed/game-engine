@customEditor(Camera)
class CameraEditor extends Editor {

    private bgColor: SerializedProperty;

    public onEnable() {
        this.bgColor = this.serializedObject.findProperty('backgroundColor');
    }

    public onUpdate() {
        EditorGui.propertyField(this.bgColor);
    }

}