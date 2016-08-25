class EditorObjectManager {

    protected static _items: GameObject[] = [];

    public static get items(): GameObject[] {
        return this._items;
    }

    public static clear(): void {
        this._items = [];
    }

    public static setItems(items: GameObject[]) {
        this._items = items;
        this.objectManagerChanged(items);
    }

    public static addItem(item: GameObject) {
        this._items.push(item);
        this.objectManagerChanged(item);
    }

    public static removeItem(item: GameObject) {
        var idx: number = this._items.indexOf(item);
        if (idx > -1) {
            this._items.splice(idx, 1);
            this.objectManagerChanged(item);
        }
    }

    public static getItemById(id: string): GameObject {
        for (var i = 0; i < this._items.length; i++){
            var gameObject: GameObject = this._items[i]
            if (id == gameObject.instanceId) {
                return gameObject;
            }
        }
    }

    private static objectManagerChanged(item) {
        window.dispatchEvent(new CustomEvent('onObjectManagerChanged', { detail: item }));
    }
}