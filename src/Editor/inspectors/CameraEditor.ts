@customEditor(Camera)
@setComponentMenu('Renderers/Camera')
class CameraEditor extends Editor {

    private bgColor: SerializedProperty;
    private fieldOfView: SerializedProperty;

    public onEnable() {
        this.bgColor = this.serializedObject.findProperty('backgroundColor');
        this.fieldOfView = this.serializedObject.findProperty('fieldOfView');
    }

    public onUpdate() {
        EditorGui.propertyField(this.bgColor);
        EditorGui.propertyField(this.fieldOfView);
    }

}