class Hierarchy {

    private static hierarchy: HTMLDivElement;
    private static hierarchyMenu;
    private static gameObjectMenu;

    public static init(hierarchyMenu: any, gameObjectMenu: any) {
        this.hierarchyMenu = hierarchyMenu;
        this.gameObjectMenu = gameObjectMenu;
        this.hierarchy = document.querySelector('section#hierarchy') as HTMLDivElement;
        this.hierarchy.addEventListener('mousedown', (event) => {
            if (event.button == 2) {
                this.hierarchyMenu.menu.popup();
            }
        });
    }

    public static update(obj: GameObject | GameObject[]) {
        this.hierarchy.innerHTML = '';
        var depth = 0;
        // var obj = event.detail;
        EditorObjectManager.items.forEach(gameObject => {
            let div = document.createElement('div');
            div.innerText = gameObject.name;
            div.classList.add('game-object');
            div.setAttribute('data-id', gameObject.instanceId);
            if (obj instanceof GameObject && obj.instanceId == gameObject.instanceId) {
                this.setSelected(div);
                this.selectGameObject(div);
            }
            div.addEventListener('click', (event) => {
                this.setSelected(div);
                window.dispatchEvent(new CustomEvent('onGameObjectSelected', { detail: div }));
            });
            // Right clicked
            div.addEventListener('mousedown', (event) => {
                if (event.button == 2) {
                    // rightClicked = div;
                    event.stopPropagation();
                    this.gameObjectMenu.menu.popup();
                }
            });
            this.hierarchy.appendChild(div);
        });
    }

    private static setSelected(target: HTMLElement) {
        let objects: NodeListOf<HTMLElement> = this.hierarchy.querySelectorAll('.game-object') as NodeListOf<HTMLElement>;
        for (let i = 0; i < objects.length; i++) {
            let obj = objects[i];
            obj.classList.remove('selected');
        }
        target.classList.add('selected');
        // this.selected = target;
    }

    public static selectGameObject(target: HTMLElement) {
        let id = target.getAttribute('data-id');
        let gameObject = EditorObjectManager.getItemById(id);
        Inspector.setSelectedGameObject(gameObject);
    }
}