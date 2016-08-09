export class GameObjectManager {

    protected static _items: GameObject[] = [];

    public static get items(): GameObject[] {
        return this._items;
    }

    public static setItems(items: GameObject[]) {
        this._items = items;
        this.objectManagerChanged();
    }

    public static addItem(item: GameObject) {
        this._items.push(item);
        this.objectManagerChanged();
    }

    public static removeItems(item: GameObject) {
        var idx: number = this._items.indexOf(item);
        if (idx > -1) {
            this._items.splice(idx, 1);
            this.objectManagerChanged();
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

    private static objectManagerChanged() {
        window.dispatchEvent(new CustomEvent('onObjectManagerChanged'));
    }
}