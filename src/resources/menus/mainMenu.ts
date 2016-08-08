import { remote, ipcRenderer } from 'electron';
let Menu = remote.Menu;

var menu = Menu.buildFromTemplate([
    {
        label: 'File'
    },
    {
        label: 'Edit'
    },
    {
        label: 'Assets'
    },
    {
        label: 'GameObject',
        submenu: [
            {
                label: 'Create Empty'
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
                label: 'Camera'
            }
        ]
    },
    {
        label: 'Component'
    },
    {
        label: 'Help'
    },
    {
        label: 'Window',
        submenu: [
            {
                label: 'Developer Tools',
                accelerator: 'f12',
                click: () => {
                    ipcRenderer.send('dev-tools');
                }
            }
        ]
    }
]);

Menu.setApplicationMenu(menu);