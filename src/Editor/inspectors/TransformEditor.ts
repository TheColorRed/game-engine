@customEditor(Transform)
@setComponentMenu('')
class TransformEditor extends Editor {

    protected position: SerializedProperty;
    protected rotation: SerializedProperty;
    protected scale: SerializedProperty;

    public onEnable() {
        this.position = this.serializedObject.findProperty('position');
        this.rotation = this.serializedObject.findProperty('rotation');
        this.scale = this.serializedObject.findProperty('scale');
    }

    public onUpdate() {
        EditorGui.propertyField(this.position);
        EditorGui.propertyField(this.rotation);
        EditorGui.propertyField(this.scale);
    }

}