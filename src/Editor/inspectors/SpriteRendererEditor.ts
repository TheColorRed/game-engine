@customEditor(SpriteRenderer)
@setComponentMenu('Renderers/Sprite Renderer')
class SpriteRendererEditor extends Editor {

    private sprite: SerializedProperty;
    private depth: SerializedProperty;

    public onEnable() {
        this.sprite = this.serializedObject.findProperty('sprite');
        this.depth = this.serializedObject.findProperty('depth');
    }

    public onUpdate() {
        EditorGui.propertyField(this.sprite);
        EditorGui.propertyField(this.depth);
    }

}