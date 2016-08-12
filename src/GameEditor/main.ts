/// <reference path="../../typings/github-electron/github-electron.d.ts"/>

import {
    BrowserWindow, app, ipcMain, dialog
} from 'electron';

let mainWindow: Electron.BrowserWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        darkTheme: true,
        hasShadow: true
    });
    mainWindow.maximize();
    mainWindow.loadURL(`file://${__dirname}/resources/views/main.html`);

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
});

ipcMain.on('open-project', (event) => {
    dialog.showOpenDialog({
        title: 'Open Project',
        properties: ['openDirectory', 'createDirectory']
    }, folders => {
        if (folders && folders.length > 0) {
            event.sender.send('open-project', folders);
        }
    });
});

ipcMain.on('dev-tools', () => {
    mainWindow.webContents.openDevTools();
});