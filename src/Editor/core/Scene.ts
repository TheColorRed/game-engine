class Scene {

    private static scene: HTMLCanvasElement;
    private static context: CanvasRenderingContext2D;

    public static init() {
        this.scene = document.querySelector('canvas#scene') as HTMLCanvasElement;
        this.context = this.scene.getContext('2d');
    }

    public static get currentScene(): HTMLCanvasElement {
        return this.scene;
    }

    public static update() {
        let drawOrder: GameObject[] = [];
        this.context.clearRect(0, 0, this.scene.width, this.scene.height);
        let $this = this;
        EditorObjectManager.items.forEach(gameObject => {
            gameObject.components.forEach(comp => {
                if (comp instanceof Camera) {
                    this.context.fillStyle = `#${comp.backgroundColor.hex}`;
                    this.context.fillRect(0, 0, this.scene.width, this.scene.height);
                }
                if (comp instanceof SpriteRenderer && comp.sprite.image) {
                    comp.sprite.image.onload = function () {
                        let c = comp as SpriteRenderer;
                        $this.context.drawImage(c.sprite.image, comp.transform.position.x, comp.transform.position.y);
                    }
                    if (comp.sprite.image) {
                        $this.context.drawImage(comp.sprite.image, comp.transform.position.x, comp.transform.position.y);
                    }
                }
            });
        });
    }

}