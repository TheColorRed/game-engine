class SpyNgin {

    private lastLoopTime = this.getNanoSeconds;
    private targetFps = 120;
    private optimalTime = 1000000000 / this.targetFps;
    private lastFpsTime = 0;

    private startTime = 0;
    private _isPlaying: boolean = false;

    private static _canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    public init(canvas: HTMLCanvasElement, prefabs: Prefab[]){
        SpyNgin._canvas = canvas;
        this.context = SpyNgin._canvas.getContext('2d');
        GameObjectManager.clear();
        prefabs.forEach(prefab => {
            Prefab.toObject(prefab);
        });
        SpyNginEvents.addEvent('keydown', (event) => {
            this.keyDown();
        }, true);
        SpyNginEvents.addEvent('keyup', (event) => {
            this.keyUp();
        }, true);
    }

    public startGame() {
        this._isPlaying = true;
        this.tick();
    }

    public stopGame() {
        this._isPlaying = false;
        SpyNginEvents.removeAllEvents();
    }

    public static get canvas(): HTMLCanvasElement {
        return SpyNgin._canvas;
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }

    private get getNanoSeconds(): number {
        return (new Date()).getTime() * 1000000;
    }

    public static clone(obj) {
        if (obj == null || typeof obj != 'object') return obj;
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

    private keyDown(): void {
        GameObjectManager.items.forEach(item => {
            item.sendMessage('keydown');
        });
    }

    private keyUp(): void {
        GameObjectManager.items.forEach(item => {
            item.sendMessage('keyup');
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
        this.context.clearRect(0, 0, SpyNgin._canvas.width, SpyNgin._canvas.height);
        let renderItems: GameObject[] = GameObjectManager.items;
        if (renderItems.length > 1) {
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
        }
        renderItems.forEach(item => {
            item.components.forEach(comp => {
                if (comp instanceof SpriteRenderer && comp.sprite.image) {
                    this.context.drawImage(comp.sprite.image, item.transform.position.x, item.transform.position.y);
                }
            });
        });
    }

}

class SpyNginEvents {

    private static evts: SpyNginEvent[] = [];

    public static addEvent(type: string, listener: EventListener, useCapture?: boolean) {
        let evt = new SpyNginEvent;
        evt.type = type;
        evt.listener = listener;
        evt.useCapture = useCapture;
        this.evts.push(evt);
        window.document.addEventListener(evt.type, evt.listener, evt.useCapture);
    }

    public static removeEvent(type: string) {
        this.evts.forEach(evt => {
            if (evt.type == type) {
                let index = this.evts.indexOf(evt);
                window.document.removeEventListener(evt.type, evt.listener, evt.useCapture);
                this.evts.splice(index, 1);
            }
        });
    }

    public static removeAllEvents() {
        this.evts.forEach(evt => {
            window.document.removeEventListener(evt.type, evt.listener, evt.useCapture);
        });
        this.evts = [];
    }

}

class SpyNginEvent {
    public type: string = '';
    public listener: EventListener = null;
    public useCapture: boolean = false;
}