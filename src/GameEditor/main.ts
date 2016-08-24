/// <reference path="../../typings/github-electron/github-electron.d.ts"/>

import {
    BrowserWindow, app, ipcMain, dialog, globalShortcut
} from 'electron';

let mainWindow: Electron.BrowserWindow;
let colorWindow: Electron.BrowserWindow;
let selectorWindow: Electron.BrowserWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        darkTheme: true,
        hasShadow: true,
        title: 'SpyNgin'
    });
    mainWindow.maximize();
    mainWindow.loadURL(`file://${__dirname}/resources/views/main.html`);

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
});

app.on('browser-window-focus', () => {
    globalShortcut.register('F2', () => {
        mainWindow.webContents.send('rename-selected');
    });
});

app.on('browser-window-blur', () => {
    globalShortcut.unregisterAll();
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

ipcMain.on('color-picker', (event, details) => {
    colorWindow = new BrowserWindow({
        width: 550,
        height: 365,
        show: false,
        darkTheme: true,
        hasShadow: true,
        parent: mainWindow,
        resizable: false
    });
    colorWindow.loadURL(`file://${__dirname}/resources/views/color.html`);
    colorWindow.setMenu(null);
    // Close the window when it is no longer focused
    colorWindow.on('blur', () => { colorWindow.close(); });
    // Display window when render is complete
    colorWindow.on('ready-to-show', () => {
        colorWindow.show();
        colorWindow.webContents.send('init', details);
        // colorWindow.webContents.openDevTools();
    });
});

ipcMain.on('color-cancel', (event) => {
    colorWindow.close();
});

ipcMain.on('color-okay', (event, contents) => {
    mainWindow.webContents.send('color-selected', contents);
    colorWindow.close();
});

ipcMain.on('selector', (event, details) => {
    selectorWindow = new BrowserWindow({
        width: 300,
        height: 550,
        show: false,
        darkTheme: true,
        hasShadow: true,
        parent: mainWindow,
        resizable: false
    });
    selectorWindow.loadURL(`file://${__dirname}/resources/views/selector.html`);
    selectorWindow.setMenu(null);
    // Close the window when it is no longer focused
    // selectorWindow.on('blur', () => { selectorWindow.close(); });
    // Display window when render is complete
    selectorWindow.on('ready-to-show', () => {
        selectorWindow.show();
        selectorWindow.webContents.send('init', details);
        // selectorWindow.webContents.openDevTools();
    });
});

ipcMain.on('selector-okay', (event, contents) => {
    mainWindow.webContents.send('selector-selected', contents);
    selectorWindow.close();
});