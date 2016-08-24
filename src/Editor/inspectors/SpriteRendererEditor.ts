@customEditor(SpriteRenderer)
@setComponentMenu('Renderers/Sprite Renderer')
class SpriteRendererEditor extends Editor {

    private sprite: SerializedProperty;

    public onEnable() {
        this.sprite = this.serializedObject.findProperty('sprite');
    }

    public onUpdate() {
        EditorGui.propertyField(this.sprite);
    }

}