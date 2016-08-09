class ObjectManager {

    protected static _items: GameObject[] = [];

    public static get items(): GameObject[] {
        return ObjectManager._items;
    }

    public static setItems(items: GameObject[]) {
        ObjectManager._items = items;
    }

    public static addItem(item: GameObject) {
        ObjectManager._items.push(item);
    }

    public static removeItems(item: GameObject) {
        var idx: number = ObjectManager._items.indexOf(item);
        if (idx > -1) {
            ObjectManager._items.splice(idx, 1);
        }
    }
}