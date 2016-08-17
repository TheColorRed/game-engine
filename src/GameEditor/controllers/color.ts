const { remote, ipcRenderer } = require('electron');

let selectedColor: Color;
let gameObjectId: string;
let componentId: string;
let propertyName: string;

let inputOkay: HTMLInputElement = document.querySelector('input#okay') as HTMLInputElement;
let inputCancel: HTMLInputElement = document.querySelector('input#cancel') as HTMLInputElement;
let inputReset: HTMLInputElement = document.querySelector('input#reset') as HTMLInputElement;

let oldColorDiv: HTMLDivElement = document.querySelector('div.old-color') as HTMLDivElement;
let newColorDiv: HTMLDivElement = document.querySelector('div.new-color') as HTMLDivElement;
// Get the HSV inputs
let h: HTMLInputElement = document.querySelector('input#h') as HTMLInputElement;
let s: HTMLInputElement = document.querySelector('input#s') as HTMLInputElement;
let v: HTMLInputElement = document.querySelector('input#v') as HTMLInputElement;
// Get the RGBA inputs
let r: HTMLInputElement = document.querySelector('input#r') as HTMLInputElement;
let g: HTMLInputElement = document.querySelector('input#g') as HTMLInputElement;
let b: HTMLInputElement = document.querySelector('input#b') as HTMLInputElement;
// let a: HTMLInputElement = document.querySelector('input#a') as HTMLInputElement;
// Get the Hex input
let hex: HTMLInputElement = document.querySelector('input#hex') as HTMLInputElement;

let colorCanvas: HTMLCanvasElement = document.querySelector('canvas#colors') as HTMLCanvasElement;
let hueCanvas: HTMLCanvasElement = document.querySelector('canvas#hues') as HTMLCanvasElement;

// If an hsv color changes
h.addEventListener('input', onUpdateHSVValues);
s.addEventListener('input', onUpdateHSVValues);
v.addEventListener('input', onUpdateHSVValues);

// If an rgba color changes
r.addEventListener('input', onUpdateRGBValues);
g.addEventListener('input', onUpdateRGBValues);
b.addEventListener('input', onUpdateRGBValues);
// a.addEventListener('input', onUpdateRGBValues);

// If the hex color changes
hex.addEventListener('input', onUpdateHexValues);


inputOkay.addEventListener('click', okay);
inputCancel.addEventListener('click', cancel);
inputReset.addEventListener('click', reset);

oldColorDiv.addEventListener('click', reset);

ipcRenderer.on('init', (event, colorDetails: { gameObjectId: string, componentId: string, propertyName: string, color: string }) => {
    selectedColor = Color.fromHex(colorDetails.color);
    gameObjectId = colorDetails.gameObjectId;
    componentId = colorDetails.componentId;
    propertyName = colorDetails.propertyName;
    oldColorDiv.setAttribute('data-hex', `#${colorDetails.color}`);
    oldColorDiv.style.backgroundColor = '#' + selectedColor.hex;
    newColorDiv.style.backgroundColor = '#' + selectedColor.hex;
    updateValues();
});

function okay(){
    ipcRenderer.send('color-okay', {
        gameObjectId: gameObjectId,
        componentId: componentId,
        propertyName: propertyName,
        hexColor: selectedColor.hex
    });
}

function cancel(){
    ipcRenderer.send('color-cancel');
}

function reset(){
    selectedColor = Color.fromHex(oldColorDiv.getAttribute('data-hex'));
    updateValues();
}

function onUpdateHSVValues(){
    selectedColor = Color.fromHsv(parseInt(h.value), parseInt(s.value), parseInt(v.value));
    updateValues();
}

function onUpdateRGBValues(){
    selectedColor = new Color(parseInt(r.value), parseInt(g.value), parseInt(b.value)/*, parseInt(a.value)*/);
    updateValues();
}

function onUpdateHexValues(){
    if(hex.value.length == 6){
        selectedColor = Color.fromHex(`#${hex.value}`);
        updateValues();
    }
}

function updateValues(){
    h.value = selectedColor.h.toString();
    s.value = selectedColor.s.toString();
    v.value = selectedColor.v.toString();

    r.value = selectedColor.r.toString();
    g.value = selectedColor.g.toString();
    b.value = selectedColor.b.toString();
    // a.value = selectedColor.a.toString();

    hex.value = selectedColor.hex.toString();
    newColorDiv.style.backgroundColor = '#' + selectedColor.hex;
    drawPicker();
    drawHues();
}

function drawPicker() {
    let colorContext = colorCanvas.getContext('2d');

    let hsv = Color.fromHsv(selectedColor.h, 100, 100);

    // Color Canvas
    let hGrad = colorContext.createLinearGradient(0, 0, 300, 0);
    hGrad.addColorStop(0, '#ffffff');
    hGrad.addColorStop(1, '#'+ hsv.hex);

    let vGrad = colorContext.createLinearGradient(0, 0, 0, 300);
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, '#000000');

    colorContext.fillStyle = hGrad;
    colorContext.fillRect(0, 0, 300, 300);

    colorContext.fillStyle = vGrad;
    colorContext.fillRect(0, 0, 300, 300);

    let rect = colorCanvas.getBoundingClientRect();

    colorContext.beginPath();
    colorContext.arc(
        Math.abs((selectedColor.s / 100 * rect.width)),
        Math.abs((selectedColor.v / 100 * rect.height) - rect.height),
        10, 0, 2 * Math.PI, false
    );
    colorContext.fillStyle = 'transparent';
    colorContext.fill();
    colorContext.lineWidth = 1;
    colorContext.strokeStyle = '#000000';
    colorContext.stroke();

    colorContext.beginPath();
    colorContext.arc(
        Math.abs((selectedColor.s / 100 * rect.width)),
        Math.abs((selectedColor.v / 100 * rect.height) - rect.height),
        9, 0, 2 * Math.PI, false
    );
    colorContext.fillStyle = 'transparent';
    colorContext.fill();
    colorContext.lineWidth = 1;
    colorContext.strokeStyle = '#ffffff';
    colorContext.stroke();
}

function drawHues(){
    let hueContext = hueCanvas.getContext('2d');

    // Hues Canvas
    let hueGrad = hueContext.createLinearGradient(0, 0, 0, 300);
    hueGrad.addColorStop(0.00, '#ff0000');
    hueGrad.addColorStop(0.20, '#ff00ff');
    hueGrad.addColorStop(0.35, '#0000ff');
    hueGrad.addColorStop(0.50, '#00ffff');
    hueGrad.addColorStop(0.65, '#00ff00');
    hueGrad.addColorStop(0.80, '#ffff00');
    hueGrad.addColorStop(1.00, '#ff0000');

    hueContext.fillStyle = hueGrad;
    hueContext.fillRect(0, 0, 20, 300);

    let rect = hueCanvas.getBoundingClientRect();

    hueContext.beginPath();
    hueContext.moveTo(0, Math.abs((selectedColor.h / 360 * rect.height) - rect.height));
    hueContext.lineTo(rect.width, Math.abs((selectedColor.h / 360 * rect.height) - rect.height));
    hueContext.stroke();
}

let mousedownColor: boolean = false;
let mousedownHue: boolean = false;

hueCanvas.addEventListener('mousedown', (event) => {
    mousedownHue = true;
    setFromHueCanvas(event);
});
hueCanvas.addEventListener('mousemove', (event) => {
    if(mousedownHue) {
        setFromHueCanvas(event);
    }
});

colorCanvas.addEventListener('mousedown', (event) => {
    mousedownColor = true;
    setFromColorCanvas(event);
});
colorCanvas.addEventListener('mousemove', (event) => {
    if(mousedownColor) {
        setFromColorCanvas(event);
    }
});

document.addEventListener('mouseup', (event) => {
    mousedownHue = false;
    mousedownColor = false;
});

function setFromColorCanvas(event){
    let rect = colorCanvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    selectedColor = Color.fromHsv(
        selectedColor.h,
        Math.abs((x / rect.width * 100)),
        Math.abs((y / rect.height * 100) - 100)
    );
    updateValues();
}

function setFromHueCanvas(event){
    let rect = hueCanvas.getBoundingClientRect();
    let y = event.clientY - rect.top;
    selectedColor = Color.fromHsv(Math.abs((y / rect.height * 360) - 360), selectedColor.s, selectedColor.v);
    updateValues();
}