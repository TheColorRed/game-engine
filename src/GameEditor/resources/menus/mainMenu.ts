import { remote, ipcRenderer } from 'electron';
let Menu = remote.Menu;

var mainMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open Project...',
                accelerator: 'ctrl+shift+o',
                click: () => {
                    ipcRenderer.send('open-project');
                }
            }
        ]
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
];

Menu.setApplicationMenu(
    Menu.buildFromTemplate(mainMenu)
);