import { remote } from 'electron';
let Menu = remote.Menu;

export const menu = Menu.buildFromTemplate([
    {
        label: 'Create Empty',
        click: () => {
            window.dispatchEvent(new CustomEvent('onCreateGameObject'));
        }
    },
    {
        label: 'Sprite',
        click: () => {
            window.dispatchEvent(new CustomEvent('onCreateSprite'));
        }
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