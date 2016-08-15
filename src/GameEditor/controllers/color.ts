const { remote, ipcRenderer } = require('electron');

let color: Color;

ipcRenderer.on('init', (event, colorDetails: { id: string, color: string }) => {
    color = Color.fromHex(`#${colorDetails.color}`);
    drawPicker();
});

window.addEventListener('update-color-picker', (event: CustomEvent) => {
    drawPicker();
});

function drawPicker() {
    let colorCanvas: HTMLCanvasElement = document.querySelector('canvas#colors') as HTMLCanvasElement;
    let hueCanvas: HTMLCanvasElement = document.querySelector('canvas#hues') as HTMLCanvasElement;

    let colorContext = colorCanvas.getContext('2d');
    let hueContext = hueCanvas.getContext('2d');

    // Color Canvas
    let hGrad = colorContext.createLinearGradient(0, 0, 300, 0);
    hGrad.addColorStop(0, '#ffffff');
    hGrad.addColorStop(1, '#ff0000');

    let vGrad = colorContext.createLinearGradient(0, 0, 0, 300);
    vGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vGrad.addColorStop(1, '#000000');

    colorContext.fillStyle = hGrad;
    colorContext.fillRect(0, 0, 300, 300);

    colorContext.fillStyle = vGrad;
    colorContext.fillRect(0, 0, 300, 300);

    // Hues Canvas
    let hueGrad = hueContext.createLinearGradient(0, 0, 0, 300);
    hueGrad.addColorStop(0.00, '#ff0000');
    hueGrad.addColorStop(0.15, '#ff00ff');
    hueGrad.addColorStop(0.30, '#0000ff');
    hueGrad.addColorStop(0.50, '#00ffff');
    hueGrad.addColorStop(0.70, '#00ff00');
    hueGrad.addColorStop(0.85, '#ffff00');
    hueGrad.addColorStop(1.00, '#ff0000');

    hueContext.fillStyle = hueGrad;
    hueContext.fillRect(0, 0, 20, 300);
}