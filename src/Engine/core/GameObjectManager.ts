class GameObjectManager {

    protected static _items: GameObject[] = [];

    public static get items(): GameObject[] {
        return this._items;
    }

    public static clear() {
        this._items = [];
    }

    public static set(items: GameObject[]) {
        this._items = items;
    }

    public static add(item: GameObject) {
        this._items.push(item);
    }

    public static remove(item: GameObject) {
        var idx: number = this._items.indexOf(item);
        if (idx > -1) {
            this._items.splice(idx, 1);
        }
    }
}