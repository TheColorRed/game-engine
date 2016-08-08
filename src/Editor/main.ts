/// <reference path="../../typings/github-electron/github-electron.d.ts"/>

import {
    BrowserWindow, app, ipcMain
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

ipcMain.on('dev-tools', () => {
    mainWindow.webContents.openDevTools();
});