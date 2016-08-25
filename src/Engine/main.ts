class SpyNginMain {

    private lastLoopTime = this.getNanoSeconds;
    private targetFps = 120;
    private optimalTime = 1000000000 / this.targetFps;
    private lastFpsTime = 0;

    private startTime = 0;
    private _isPlaying: boolean = false;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    public init(canvas: HTMLCanvasElement, prefabs: Prefab[]){
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        GameObjectManager.clear();
        prefabs.forEach(prefab => {
            Prefab.toObject(prefab);
        });
    }

    public startGame() {
        this._isPlaying = true;
        this.tick();
    }

    public stopGame() {
        this._isPlaying = false;
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }

    private get getNanoSeconds(): number {
        return (new Date()).getTime() * 1000000;
    }

    protected clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = new obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    protected tick(): void {
        let d = new Date().getTime();
        Time.setFrameTime((d - this.startTime) / 1000);
        var nanoSeconds = this.getNanoSeconds;
        var now = nanoSeconds;
        var updateLength = now - this.lastLoopTime;
        this.lastLoopTime = now;
        var delta = updateLength / this.optimalTime;

        this.lastFpsTime += updateLength;
        if (this.lastFpsTime >= 1000000000) {
            this.lastFpsTime = 0;
        }

        Time.setDeltaTime(delta / this.targetFps);

        this.awake();
        this.enable();
        this.start();

        this.update();

        this.lastCheck();

        this.render();

        var next = (this.lastLoopTime - nanoSeconds + this.optimalTime) / 1000000;
        if(this.isPlaying){
            setTimeout(this.tick.bind(this), next);
        }
    }

    protected awake(): void {
        GameObjectManager.items.forEach(item => {
            item.sendMessage('awake');
        });
    }

    protected enable(): void {
        GameObjectManager.items.forEach(item => {
            if (!item.lastFrameEnabled) {
                item.sendMessage('onEnable');
            }
        });
    }

    protected start(): void {
        GameObjectManager.items.forEach(item => {
            item.sendMessage('start');
        });
    }

    private update(): void {
        GameObjectManager.items.forEach(item => {
            item.sendMessage('update');
        });
    }

    private lateUpdate(): void {
        GameObjectManager.items.forEach(item => {
            item.sendMessage('lateUpdate');
        });
    }

    private lastCheck() {
        GameObjectManager.items.forEach(item => {
            if (item.shouldDisable) {
                item.isEnabled = false;
                item.shouldDisable = false;
            }
            item.components.forEach(comp => {
                if (!comp.isEnabled) {
                    item.lastFrameEnabled = false;
                } else {
                    item.lastFrameEnabled = true;
                }
                if (item.shouldDisable) {
                    comp.behavior.isEnabled = false;
                }
            });
        });
    }

    private render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let renderItems: GameObject[] = GameObjectManager.items;
        renderItems.sort(function (a, b) {
            let ar = a.getComponent(SpriteRenderer);
            let br = b.getComponent(SpriteRenderer);
            if (ar && br) {
                if (ar.depth < br.depth)
                    return -1;
                if (ar.depth > br.depth)
                    return 1;
            }
            return 0;
        });
        // console.log(renderItems)
        renderItems.forEach(item => {
            item.components.forEach(comp => {
                if (comp instanceof SpriteRenderer && comp.sprite.image) {
                    this.context.drawImage(comp.sprite.image, item.transform.position.x, item.transform.position.y);
                }
            });
        });
    }

}