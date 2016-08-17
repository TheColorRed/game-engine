import { remote } from 'electron';
let Menu = remote.Menu;

export const gameObjectMenu = Menu.buildFromTemplate([
    {
        label: 'Create Empty Child',
        click: () => {
            window.dispatchEvent(new CustomEvent('onCreateGameobject', { detail: { child: true }}));
        }
    },
    {
        label: 'Delete',
        click: () => {
            window.dispatchEvent(new CustomEvent('onDeleteGameObject'));
        }
    }
]);