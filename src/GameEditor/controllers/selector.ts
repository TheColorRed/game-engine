const { remote, ipcRenderer } = require('electron');
const recursive = require('recursive-readdir');

import fs = require('fs');
import path = require('path');

let selectionType: string;
let gameObjectId: string;
let componentId: string;
let propertyName: string;

let filter: HTMLInputElement = document.querySelector('input#query') as HTMLInputElement;
let itemList: HTMLDivElement = document.querySelector('div.item-list') as HTMLDivElement;

filter.focus();

ipcRenderer.on('init', (event, selectDetails: { gameObjectId: string, componentId: string, propertyName: string, selectionType: string }) => {
    selectionType = selectDetails.selectionType;
    gameObjectId = selectDetails.gameObjectId;
    componentId = selectDetails.componentId;
    propertyName = selectDetails.propertyName;
    switch (selectionType.toLowerCase()) {
        case 'sprite':
            document.querySelector('title').innerHTML = 'Sprite Selector';
            loadFiles('/Users/rnaddy/Pictures');
            break;
        case 'gameobject':
            document.querySelector('title').innerHTML = 'GameObject Selector';
            break;
        case 'transform':
            document.querySelector('title').innerHTML = 'Transform Selector';
            break;
    }
});

function loadFiles(dirpath: string) {
    recursive(dirpath, (err, files) => {
        let itemsToShow: string[] = [];
        files.forEach(file => {
            let ext = path.extname(file).toLowerCase();
            switch (selectionType.toLowerCase()) {
                case 'sprite':
                    if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(ext) > -1) {
                        itemsToShow.push(file);
                    }
                    break;
            }
        });

        showFiles(itemsToShow);
        filter.addEventListener('keyup', event => {
            if (event.keyCode != 13 && event.keyCode != 38 && event.keyCode != 40) {
                showFiles(itemsToShow, filter.value);
            }
            let items = itemList.querySelectorAll('a.list-item') as NodeListOf<HTMLAnchorElement>;
            let selected = itemList.querySelector('.list-item.selected') as HTMLAnchorElement;
            let offset: number = -1;
            if (selected != null) {
                offset = parseInt(selected.getAttribute('data-offset'));
            }

            let next = offset + 1;
            let prev = offset - 1;
            next = next > items.length - 1 ? 0 : next;
            prev = prev < 0 ? items.length - 1 : prev;

            // Enter
            if (event.keyCode == 13) {
                let selected = itemList.querySelector('.list-item.selected') as HTMLAnchorElement;
                okay(selected.getAttribute('data-value'));
            }
            // Up
            if (event.keyCode == 38) {
                event.preventDefault();
                if (selected != null) {
                    selected.classList.remove('selected');
                }
                let newItem = itemList.querySelector(`.list-item[data-offset="${prev}"]`) as HTMLAnchorElement;
                newItem.classList.add('selected');
            }
            // Down
            if (event.keyCode == 40) {
                event.preventDefault();
                if (selected != null) {
                    selected.classList.remove('selected');
                }
                let newItem = itemList.querySelector(`.list-item[data-offset="${next}"]`) as HTMLAnchorElement;
                newItem.classList.add('selected');
            }
        });
    });
}

function showFiles(filesToShow: string[], query: string = '') {
    itemList.innerHTML = '';
    let c = 0;
    filesToShow.forEach(file => {
        let parsed = path.parse(file);
        console.log(file)
        let regexp = new RegExp(query, 'ig');
        if (query.length == 0 || regexp.test(parsed.name)) {
            let item = document.createElement('div') as HTMLDivElement;
            item.innerHTML = `<a href="" data-value="${file}" data-offset="${c}" class="list-item ${c == 0 && query.length > 0 ? 'selected' : ''}">${parsed.name}</a>`;
            itemList.appendChild(item);
            c++;
        }
    });
    let links = itemList.querySelectorAll('a.list-item') as NodeListOf<HTMLAnchorElement>;
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        link.addEventListener('click', event => {
            event.preventDefault();
            okay(link.getAttribute('data-value'));
        });
    }
}

function okay(value: string) {
    ipcRenderer.send('selector-okay', {
        gameObjectId: gameObjectId,
        componentId: componentId,
        propertyName: propertyName,
        value: value
    });
}