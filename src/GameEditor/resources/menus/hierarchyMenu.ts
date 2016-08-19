import { remote } from 'electron';
let Menu = remote.Menu;

export const menu = Menu.buildFromTemplate([
    {
        label: 'Create Empty',
        click: () => {
            window.dispatchEvent(new CustomEvent('onCreateGameobject'));
        }
    },
    {
        label: 'Sprite'
    },
    {
        label: 'Light'
    },
    {
        label: 'Audio',
    },
    {
        label: 'UI'
    },
    {
        label: 'Particle System'
    },
    {
        label: 'Camera',
        click: () => {
            window.dispatchEvent(new CustomEvent('onCreateCamera'));
        }
    }
]);