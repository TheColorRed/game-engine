class ObjectManager {

    protected static _items: GameObject[] = [];

    public static get items(): GameObject[] {
        return this._items;
    }

    public static setItems(items: GameObject[]) {
        this._items = items;
    }

    public static addItem(item: GameObject) {
        this._items.push(item);
    }

    public static removeItems(item: GameObject) {
        var idx: number = this._items.indexOf(item);
        if (idx > -1) {
            this._items.splice(idx, 1);
        }
    }
}